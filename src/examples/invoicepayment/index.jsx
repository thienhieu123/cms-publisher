import SuiBox from "~/components/SuiBox";
import SuiTypography from "~/components/SuiTypography";
import SuiButton from "~/components/SuiButton";
import { Card, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import Table from "~/examples/Tables/Table";
import { formatMoney } from "~/utils/utils";

const columns = [
  {
    name: "MÃ HÓA ĐƠN",
    align: "center",
  },
  {
    name: "KỲ HÓA ĐƠN",
    align: "center",
  },
  {
    name: "SỐ HỢP ĐỒNG",
    align: "center",
  },
  {
    name: "SỐ TIỀN CẦN THANH TOÁN",
    align: "center",
  },
];
function InvoicePayment(props) {
  const { close, TableInfo, payment, column2 } = props;

  const handlePayment = () => {
    close(false);
    payment(true);
  };
  const { checkedBills } = TableInfo;
  const table = checkedBills?.map((item) => ({
    "MÃ HÓA ĐƠN": item.billCode,
    "KỲ HÓA ĐƠN": item.billPeriod,
    "SỐ HỢP ĐỒNG": item.contractCode,
    "SỐ TIỀN CẦN THANH TOÁN": formatMoney(item.totalHavePay),
  }));
  const tableFooter = [
    {
      "Số hợp đồng": (
        <SuiTypography sx={{ fontSize: "14px", fontWeight: "700", color: "var(--black)" }}>
          Tạm tính
        </SuiTypography>
      ),
      "Số tiền cần thanh toán": (
        <SuiTypography sx={{ fontSize: "14px", fontWeight: "400", color: "var(--black)" }}>
          {formatMoney(TableInfo.tempTotal)}
        </SuiTypography>
      ),
    },
    {
      "Số hợp đồng": (
        <SuiTypography sx={{ fontSize: "14px", fontWeight: "700", color: "var(--black)" }}>
          Thuế VAT
        </SuiTypography>
      ),
      "Số tiền cần thanh toán": (
        <SuiTypography sx={{ fontSize: "14px", fontWeight: "400", color: "var(--black)" }}>
          {formatMoney(TableInfo.vat)}
        </SuiTypography>
      ),
    },
    {
      "Số hợp đồng": (
        <SuiTypography sx={{ fontSize: "22px", fontWeight: "700", color: "var(--black)" }}>
          Tổng cộng
        </SuiTypography>
      ),
      "Số tiền cần thanh toán": (
        <SuiTypography sx={{ fontSize: "14px", fontWeight: "400", color: "var(--black)" }}>
          {formatMoney(TableInfo.totalPay)}
        </SuiTypography>
      ),
    },
  ];
  return (
    <SuiBox
      sx={{
        width: "42rem",
        minWidth: "20rem",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        zIndex: "2200",
        "@media (max-width: 1400px)": {
          width: "60%",
        },
      }}
    >
      <Card>
        <Grid container spacing={3} p={3}>
          <SuiBox
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
              cursor: "pointer",
            }}
            onClick={() => close(false)}
          >
            <CloseIcon />
          </SuiBox>
          <Grid item xs={12} xl={12} sx={{ display: "flex", justifyContent: "center" }}>
            <SuiTypography
              variant="h4"
              sx={{
                fontSize: "20px",
                fontWeight: "600",
                color: "var(--black)",
                paddingBottom: "10px",
              }}
            >
              Thanh Toán Hóa Đơn ({table?.length})
            </SuiTypography>
          </Grid>
          <Grid
            item
            xs={12}
            xl={12}
            sx={{ display: "flex", justifyContent: "center", padding: "0!important" }}
          >
            <SuiTypography
              variant="h4"
              sx={{
                fontSize: "16px",
                fontWeight: "600",
                color: "var(--gray-100)",
                textTransform: "unset",
              }}
            >
              Vui lòng kiểm tra thông tin hóa đơn
            </SuiTypography>
          </Grid>
          <Grid item xs={12} xl={12}>
            <Table
              columns={columns}
              rows={table}
              rowsCount={table?.length}
              size="0.8rem"
              isPagination={false}
              borderRadius="0"
              maxHeight="400px"
            />
            <Table
              columns={column2}
              rows={tableFooter}
              rowsCount={tableFooter.length}
              size="0.8rem"
              isPagination={false}
              hideTitle
              alignSize="10vw"
              highlight
              margin="-8px 0 0 0"
              borderRadius="0"
            />
          </Grid>
          <Grid item xs={12} xl={12} display="flex" justifyContent="center">
            <SuiButton
              size="small"
              color="info"
              circular
              px={1}
              py={3}
              onClick={handlePayment}
              sx={{
                background: "var(--blue-blue-100)",
                borderRadius: "5px",
                padding: "8px 24px",
              }}
            >
              <SuiTypography
                whiteSpace="nowrap"
                variant="body2"
                color="white"
                fontSize="14px"
                sx={{
                  fontWeight: "700",
                }}
              >
                Thanh toán
              </SuiTypography>
            </SuiButton>
          </Grid>
        </Grid>
      </Card>
    </SuiBox>
  );
}

InvoicePayment.propTypes = {
  close: PropTypes.func.isRequired,
  TableInfo: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  payment: PropTypes.func.isRequired,
  column2: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
};
export default InvoicePayment;
