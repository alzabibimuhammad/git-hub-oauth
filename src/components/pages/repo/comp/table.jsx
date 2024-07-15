import Table from "@/components/@core/table";
import useRepoColumns from "../hooks/useRepoColumns";
import { RepoInfra } from "../infrastructure";

export default function RepoTable({ row }) {
  const { columns } = useRepoColumns();
  const rows = row?.map((row) => new RepoInfra(row));

  return (
    <Table
      checkboxSelection={false}
      rowHeight={60}
      row={rows}
      column={columns}
    />
  );
}
