type ProductStatusProps = {
  isActive: boolean;
};

export default function ProductStatus({
  isActive,
}: ProductStatusProps) {
  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${
          isActive
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }
      `}
    >
      <span
        className={`
          mr-2
          h-2
          w-2
          rounded-full
          ${
            isActive
              ? "bg-green-500"
              : "bg-red-500"
          }
        `}
      />

      {isActive ? "Active" : "Inactive"}
    </span>
  );
}