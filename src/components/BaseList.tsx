import React from "react";

interface Base {
  id: number;
  name: string;
  imageUrl: string;
  link: string;
  user: {
    name: string;
  };
}

interface BaseListProps {
  bases: Base[];
}

const BaseList: React.FC<BaseListProps> = ({ bases }) => {
  if (!bases || bases.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div className="p-4">
      {bases.map((base) => (
        <div key={base.id} className="border p-4 mb-4 rounded shadow">
          <h2 className="text-xl font-bold">{base.name}</h2>
          <img
            src={base.imageUrl}
            alt={base.name}
            className="w-full h-auto mt-2"
          />
          <p className="mt-2">Created by: {base.user.name}</p>
          <a href={base.link} className="text-blue-500 mt-2 inline-block">
            View More
          </a>
        </div>
      ))}
    </div>
  );
};

export default BaseList;
