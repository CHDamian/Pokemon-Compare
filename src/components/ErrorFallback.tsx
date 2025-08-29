import { Alert, Button } from "@mui/material";

type Props = {
  error: Error;
  resetErrorBoundary: () => void;
};

const ErrorFallback = ({ error, resetErrorBoundary }: Props) => {
  return (
    <div style={{ padding: "20px" }}>
      <Alert severity="error" style={{ marginBottom: "16px" }}>
        <strong>Ups! Coś poszło nie tak.</strong>
        <br />
        {error.message}
      </Alert>
      <Button variant="contained" color="primary" onClick={resetErrorBoundary}>
        Spróbuj ponownie
      </Button>
    </div>
  );
};

export default ErrorFallback;
