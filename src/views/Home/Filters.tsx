import { Box, FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material";

interface FiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  firstType: string;
  secondType: string;
  allTypes: string[];
  onFirstTypeChange: (value: string) => void;
  onSecondTypeChange: (value: string) => void;
}

const Filters = ({
  search, onSearchChange,
  firstType, secondType, allTypes,
  onFirstTypeChange, onSecondTypeChange,
}: FiltersProps) => (
  <>
    {/* 🔍 wyszukiwarka */}
    <Box mb={2}>
      <TextField
        label="Szukaj po nazwie"
        variant="outlined"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        fullWidth
      />
    </Box>

    {/* 🔽 filtry typów */}
    <Box mb={2} display="flex" gap={2} flexWrap="wrap">
      <FormControl sx={{ minWidth: 180 }}>
        <InputLabel id="first-type-label">Typ 1</InputLabel>
        <Select
          labelId="first-type-label"
          value={firstType}
          onChange={(e) => onFirstTypeChange(e.target.value)}
        >
          <MenuItem value=""><em>Brak</em></MenuItem>
          {allTypes.map((t) => (
            <MenuItem key={t} value={t}>{t}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 180 }} disabled={!firstType}>
        <InputLabel id="second-type-label">Typ 2</InputLabel>
        <Select
          labelId="second-type-label"
          value={secondType}
          onChange={(e) => onSecondTypeChange(e.target.value)}
        >
          <MenuItem value=""><em>Brak</em></MenuItem>
          {allTypes.filter(t => t !== firstType).map((t) => (
            <MenuItem key={t} value={t}>{t}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  </>
);

export default Filters;
