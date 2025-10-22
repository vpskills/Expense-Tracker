import type { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import type { AuthRequest } from '../../middleware/auth.middleware.js';
import { ApiError } from '../../utils/ApiError.js';

const prisma = new PrismaClient();

export const exportExpenses = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { selectedDate, docType } = req.query;

        if (!userId) {
            throw new ApiError('Unauthorized user!', 401);
        }

        if (!selectedDate || typeof selectedDate !== 'string') {
            throw new ApiError('Missing or invalid parameters', 400);
        }

        if (!docType || (docType !== 'excel' && docType !== 'pdf')) {
            throw new ApiError('Invalid document type. Must be "excel" or "pdf"', 400);
        }

        const date = new Date(selectedDate);

        if (isNaN(date.getTime())) {
            throw new ApiError('Invalid date format', 400);
        }

        // Extract year and month
        const year = date.getFullYear();
        const monthNum = date.getMonth() + 1;

        // Construct start and end of month
        const start = `${year}-${String(monthNum).padStart(2, '0')}-01`;

        // Calculate the first day of NEXT month
        const nextMonth = monthNum === 12 ? 1 : monthNum + 1;
        const nextYear = monthNum === 12 ? year + 1 : year;
        const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

        // Format for display (YYYY-MM)
        const monthDisplay = `${year}-${String(monthNum).padStart(2, '0')}`;

        // Fetch expenses for user within that month
        const expenses = await prisma.expense.findMany({
            where: {
                userId: userId,
                date: {
                    gte: start,
                    lt: endDate
                },
            },
            include: { category: true },
            orderBy: { date: 'asc' },
        });

        if (!expenses.length) {
            return res.status(404).json({ message: 'No expenses found for this month' });
        }

        // Calculate totals
        const totalExpense = expenses
            .filter((e) => e.isExpense)
            .reduce((sum: number, e: typeof expenses[number]) => sum + e.amount, 0);

        const totalIncome: number = expenses
            .filter((e) => !e.isExpense)
            .reduce((sum, e) => sum + e.amount, 0);

        const netBalance = totalIncome - totalExpense;

        // ----------------- 📊 EXCEL EXPORT -----------------
        if (docType === 'excel') {
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Monthly Expenses');

            // Header row
            sheet.columns = [
                { header: 'Date', key: 'date', width: 15 },
                { header: 'Description', key: 'description', width: 30 },
                { header: 'Category', key: 'category', width: 20 },
                { header: 'Amount (₹)', key: 'amount', width: 15 },
                { header: 'Type', key: 'type', width: 15 },
            ];

            // Add rows
            expenses.forEach((exp) => {
                sheet.addRow({
                    date: exp.date,
                    description: exp.description || '-',
                    category: exp.category?.label || 'N/A',
                    amount: exp.amount,
                    type: exp.isExpense ? 'Expense' : 'Income',
                });
            });

            // Add total summary
            sheet.addRow({});
            sheet.addRow({ description: 'Total Expense', amount: totalExpense });
            sheet.addRow({ description: 'Total Income', amount: totalIncome });
            sheet.addRow({ description: 'Net Balance', amount: netBalance });

            // Styling
            sheet.getRow(1).font = { bold: true };
            sheet.columns.forEach((col) => {
                if (col.alignment) {
                    col.alignment = { horizontal: 'center' };
                }
            });

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                `attachment; filename=expenses-${monthDisplay}.xlsx`
            );

            await workbook.xlsx.write(res);
            return res.end();
        }

        // ----------------- 📄 PDF EXPORT (FIXED) -----------------
        if (docType === 'pdf') {
            const doc = new PDFDocument({
                margin: 40,
                size: 'A4'
            });

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                `attachment; filename=expenses-${monthDisplay}.pdf`
            );
            doc.pipe(res);

            // Title
            doc.fontSize(20).font('Helvetica-Bold')
                .text(`Expense Report (${monthDisplay})`, { align: 'center' });
            doc.moveDown(1.5);

            // Define column positions and widths (full page width)
            const tableLeft = 40;
            const tableRight = 555; // A4 width (595) - right margin (40)
            const tableWidth = tableRight - tableLeft; // 515px total

            const colWidths = {
                date: 75,
                description: 180,
                category: 110,
                amount: 80,
                type: 70
            };

            const colPositions = {
                date: tableLeft,
                description: tableLeft + colWidths.date,
                category: tableLeft + colWidths.date + colWidths.description,
                amount: tableLeft + colWidths.date + colWidths.description + colWidths.category,
                type: tableLeft + colWidths.date + colWidths.description + colWidths.category + colWidths.amount
            };

            // Table Header with background
            const headerY = doc.y;
            doc.rect(tableLeft, headerY - 5, tableWidth, 20)
                .fill('#4B5563');

            doc.fontSize(11).font('Helvetica-Bold').fillColor('white');
            doc.text('Date', colPositions.date + 5, headerY, { width: colWidths.date, continued: false });
            doc.text('Description', colPositions.description + 5, headerY, { width: colWidths.description, continued: false });
            doc.text('Category', colPositions.category + 5, headerY, { width: colWidths.category, continued: false });
            doc.text('Amount', colPositions.amount, headerY, { width: colWidths.amount, align: 'center', continued: false });
            doc.text('Type', colPositions.type + 5, headerY, { width: colWidths.type, continued: false });

            doc.moveDown(0.8);
            doc.font('Helvetica').fontSize(10).fillColor('black');

            // Table Rows with alternating colors
            expenses.forEach((exp, index) => {
                const rowY = doc.y;

                // Check if we need a new page
                if (rowY > 700) {
                    doc.addPage();
                }

                // Alternating row background
                if (index % 2 === 0) {
                    doc.rect(tableLeft, rowY - 2, tableWidth, 18)
                        .fill('#F3F4F6');
                    doc.fillColor('black');
                }

                // Truncate description if too long
                const desc = (exp.description || '-').length > 30
                    ? (exp.description || '-').substring(0, 27) + '...'
                    : (exp.description || '-');

                doc.text(exp.date, colPositions.date + 5, rowY, {
                    width: colWidths.date,
                    continued: false
                });

                doc.text(desc, colPositions.description + 5, rowY, {
                    width: colWidths.description,
                    continued: false
                });

                doc.text(exp.category?.label || 'N/A', colPositions.category + 5, rowY, {
                    width: colWidths.category,
                    continued: false
                });

                doc.text(`Rs. ${exp.amount.toFixed(2)}`, colPositions.amount, rowY, {
                    width: colWidths.amount,
                    align: 'center',
                    continued: false
                });

                doc.text(exp.isExpense ? 'Expense' : 'Income', colPositions.type + 5, rowY, {
                    width: colWidths.type,
                    continued: false
                });

                doc.moveDown(0.5);
            });

            // Summary Section
            doc.moveDown(2);
            const summaryX = 320;
            const summaryWidth = 240;
            const boxHeight = 90;

            doc.fontSize(13).font('Helvetica-Bold');
            doc.rect(summaryX, doc.y - 5, summaryWidth, boxHeight).stroke('#4B5563');

            const summaryY = doc.y + 5;

            // Total Expense Row
            doc.text('Total Expense:', summaryX + 15, summaryY, { continued: false });
            doc.text(`Rs. ${totalExpense.toFixed(2)}`, summaryX + summaryWidth - 95, summaryY, {
                width: 80,
                align: 'right',
                continued: false
            });

            // Total Income Row
            doc.moveDown(0.7);
            const incomeY = doc.y;
            doc.text('Total Income:', summaryX + 15, incomeY, { continued: false });
            doc.text(`Rs. ${totalIncome.toFixed(2)}`, summaryX + summaryWidth - 95, incomeY, {
                width: 80,
                align: 'right',
                continued: false
            });

            // Net Balance Row
            doc.moveDown(0.7);
            const balanceY = doc.y;
            doc.fillColor(netBalance >= 0 ? '#10B981' : '#EF4444');
            doc.text('Net Balance:', summaryX + 15, balanceY, { continued: false });
            doc.text(`Rs. ${netBalance.toFixed(2)}`, summaryX + summaryWidth - 95, balanceY, {
                width: 80,
                align: 'right',
                continued: false
            });

            doc.fillColor('black').font('Helvetica');

            // Footer
            doc.moveDown(4);

            // Get current Y position for footer
            const footerY = doc.y;
            const footerLeft = 40;
            const footerRight = 555;

            doc.fontSize(9).fillColor('#9CA3AF');

            // Left aligned text
            doc.text('Generated by Expense Tracker', footerLeft, footerY, {
                width: 250,
                align: 'left',
                continued: false
            });

            // Right aligned timestamp
            doc.text(new Date().toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short'
            }), footerRight - 150, footerY, {
                width: 150,
                align: 'right',
                continued: false
            });

            doc.end();
            return;
        }

        return res.status(400).json({ message: 'Invalid export type' });
    } catch (error) {
        console.error('Export error:', error);
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Failed to export expenses' });
    }
};