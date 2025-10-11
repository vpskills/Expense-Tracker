import React from 'react';
import Skeleton from '../Skeleton';

const ExpenseCategory = ({ isAnyExpenseMutating, expense }) => {
  // this component is for display category of single expense record
  return (
    <div className={`text-[12px] md:text-xs bg-neutral-800 pt-0.5 px-1.5 font-mono rounded-full font-semibold flex justify-center items-center`}>
      {isAnyExpenseMutating && expense?.category === undefined ? (
        <Skeleton />
      ) : (
        expense?.category && `${expense?.category?.emoji ? expense?.category?.emoji : "⭕️"} ${expense?.category?.label}`
      )}
    </div>
  );
};

export default ExpenseCategory;
