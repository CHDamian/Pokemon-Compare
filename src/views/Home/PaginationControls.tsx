import { Box, Button, Pagination, TextField, Typography } from "@mui/material";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  pageInput: string;
  onPageChange: (value: number) => void;
  onPageInputChange: (value: string) => void;
  onGoToPage: () => void;
}

const PaginationControls = ({
  page, totalPages, pageInput,
  onPageChange, onPageInputChange, onGoToPage,
}: PaginationControlsProps) => (
  <Box mt={2} display="flex" justifyContent="center" alignItems="center" gap={2} flexWrap="wrap">
    <Pagination count={totalPages} page={page} onChange={(_, v) => onPageChange(v)} color="primary" />

    <Box display="flex" alignItems="center" gap={1}>
      <TextField
        label="Strona"
        type="number"
        size="small"
        value={pageInput}
        onChange={(e) => onPageInputChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onGoToPage()}
        sx={{ width: 100 }}
      />
      <Button variant="outlined" onClick={onGoToPage}>Idź</Button>
      <Typography variant="body2">/ {totalPages}</Typography>
    </Box>
  </Box>
);

export default PaginationControls;
