import { TableRow, TableCell, Chip } from "@mui/material";
import { type Pokemon } from "../../types/Pokemon";

interface CompareStatsRowsProps {
  first: Pokemon;
  second: Pokemon;
}

const CompareStatsRows = ({ first, second }: CompareStatsRowsProps) => {
  return (
    <>
      {first.stats.map((s, i) => {
        const statName = s.stat.name;
        const statA =
          first.stats.find((stat) => stat.stat.name === statName)?.base_stat ?? 0;
        const statB =
          second.stats.find((stat) => stat.stat.name === statName)?.base_stat ?? 0;

        const colorA =
          statA > statB ? "success" : statA < statB ? "default" : "info";
        const colorB =
          statB > statA ? "success" : statB < statA ? "default" : "info";

        return (
          <TableRow key={i}>
            <TableCell>
              <strong>{statName}</strong>
            </TableCell>
            <TableCell align="center">
              <Chip label={statA} color={colorA as any} />
            </TableCell>
            <TableCell align="center">
              <Chip label={statB} color={colorB as any} />
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
};

export default CompareStatsRows;
