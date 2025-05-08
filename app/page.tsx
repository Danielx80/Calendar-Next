"use client";
import { DndContext } from "@dnd-kit/core";
import { Table } from "../components/calendar";

export default function Home() {
  return (
    <DndContext id="draggable-table-01">
      <Table />
    </DndContext>
  );
}
