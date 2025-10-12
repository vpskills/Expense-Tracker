import React from 'react';
import Skeleton from '../Skeleton';

const ExpenseCategory = ({ isAnyExpenseMutating, expense }) => {
  // this component is for display category of single expense record
  return (
    <div>
      {isAnyExpenseMutating && expense?.category === undefined ? (
        <Skeleton />
      ) : (
        <div
          className={`text-[10px] md:text-xs bg-stone-900 text-gray-300 border border-stone-800 py-0.5 px-1.5 font-mono rounded-full font-semibold flex justify-center items-center w-max`}
        >
          {expense?.category &&
            `${expense?.category?.emoji ? expense?.category?.emoji : '⭕️'} ${
              expense?.category?.label
            }`}
        </div>
      )}
    </div>
  );
};

export default ExpenseCategory;
