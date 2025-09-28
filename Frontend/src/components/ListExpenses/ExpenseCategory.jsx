import React from 'react';

const ExpenseCategory = ({ isAnyExpenseMutating, expense }) => {
  // this component is for display category of single expense record
  return (
    <div className={`text-[12px] md:text-xs text-emerald-500 font-semibold inline-block`}>
      {isAnyExpenseMutating && expense?.category === undefined ? (
        <Skeleton />
      ) : (
        expense?.category && `${expense?.category?.emoji} ${expense?.category?.label}`
      )}
    </div>
  );
};

export default ExpenseCategory;
