import { flatbedMachine, robotCellMachine } from "./illustrations/machines.mjs";
for (const [label, m] of [
  ["f6020-hd inUse", flatbedMachine("ra-f6020-hd", { inUse: true })],
  ["f1530", flatbedMachine("ra-f1530", { inUse: true })],
  ["robot2", robotCellMachine(2, { inUse: true })],
]) {
  const [minX, minY, maxX, maxY] = m.bbox;
  console.log(label, "bbox", m.bbox, "bw", maxX - minX, "bh", maxY - minY, "aspect", ((maxX - minX) / (maxY - minY)).toFixed(2));
}
