import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";

function TableWrapper({
  tableStyle,
  spanTd,
  message,
  isLoading,
  isContent,
  children,
  thContent,
  ...props
}) {
  const { t } = useTranslation();
  return (
    <TableContainer>
      <Table sx={tableStyle}>
        <TableHead sx={{ backgroundColor: "#333" }}>{thContent}</TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={spanTd} align="center">
                <CircularProgress size={22} />
              </TableCell>
            </TableRow>
          ) : isContent ? (
            children
          ) : (
            <TableRow>
              <TableCell colSpan={spanTd} align="center">
                <Typography variant="caption1">
                  {!!message ? message : t("COMMON.no_record")}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
TableWrapper.defaultProps = {
  tableStyle: {},
  spanTd: "1",
  message: null,
  isContent: false,
  isLoading: false,
};
export default TableWrapper;
