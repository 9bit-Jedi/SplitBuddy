import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getUserMonthlyExpService } from "../../services/expenseServices";
import AlertBanner from "../AlertBanner";
import Loading from "../loading";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { convertToCurrency } from "../../utils/helper";

export const MonthlyExpenseGraph = () => {
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [monthlyExp, setMonthlyExp] = useState([]);

  const data = {
    labels: monthlyExp?.map((item) => item.month),
    datasets: [
      {
        label: "Monthly Expenses",
        data: monthlyExp?.map((item) => item.total),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        display: false,
      },
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value, index, values) {
            return convertToCurrency(value);
          },
        },
      },
    },
  };

  useEffect(() => {
    const getMonthlyExpense = async () => {
      setLoading(true);
      const monthly_exp = await getUserMonthlyExpService(
        setAlert,
        setAlertMessage
      );
      setMonthlyExp(monthly_exp);
      setLoading(false);
    };
    getMonthlyExpense();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box
          sx={{
            p: 5,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 5,
          }}
        >
          <Typography variant="h6" mb={2}>
            Your Monthly Expenses
          </Typography>
          <AlertBanner
            showAlert={alert}
            alertMessage={alertMessage}
            severity="error"
          />
          <Box height={500}>
            <Bar data={data} options={options} />
          </Box>
        </Box>
      )}
    </>
  );
};
