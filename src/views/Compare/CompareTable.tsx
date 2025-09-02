import { Table, TableBody, TableContainer, Paper } from "@mui/material";
import { type Pokemon } from "../../types/Pokemon";
import CompareTableHeader from "./CompareTableHeader";
import CompareTypesRow from "./CompareTypesRow";
import CompareAbilitiesRow from "./CompareAbilitiesRow";
import CompareStatsRows from "./CompareStatsRows";

interface CompareTableProps {
  selected: Pokemon[];
}

const CompareTable = ({ selected }: CompareTableProps) => {
  const [first, second] = selected;

  return (
    <TableContainer component={Paper}>
      <Table>
        <CompareTableHeader selected={selected} />
        <TableBody>
          <CompareTypesRow selected={selected} />
          <CompareAbilitiesRow selected={selected} />
          <CompareStatsRows first={first} second={second} />
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CompareTable;
