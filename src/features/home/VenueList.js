import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Pagination,
  Box,
} from "@mui/material";

function VenueList() {
  const [venues, setVenues] = useState([]);
  const [topVenues, setTopVenues] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    loadTopVenues();
  }, []);

  useEffect(() => {
    loadVenues();
  }, [page]);

  const loadTopVenues = () => {
    axios
      .get("http://localhost:8080/api/home/top5")
      .then((res) => Array.isArray(res.data) && setTopVenues(res.data))
      .catch((err) => console.error(err));
  };

  const loadVenues = () => {
    axios
      .get(`http://localhost:8080/api/home?page=${page}&size=10`)
      .then((res) => {
        const content = Array.isArray(res.data) ? res.data : res.data?.content || [];
        setVenues(content);
        setTotalPages(res.data?.totalPages || 1);
      })
      .catch((err) => console.error(err));
  };

  const handlePageChange = (event, value) => {
    setPage(value - 1); // MUI Pagination bắt đầu từ 1, nhưng state page bắt đầu từ 0
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* ============ TOP VENUE ============ */}
      <Typography variant="h4" component="h2" sx={{ textAlign: "center", mb: 3 }}>
        Sân nổi bật
      </Typography>
      <Grid container spacing={3} sx={{ mb: 5, justifyContent: 'center' }}>
        {topVenues.map((v) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={v.venueId}> {/* 5 cột trên lg (12/5=2.4) */}
            <Card
              sx={{
                maxWidth: 345,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={
                  v.mainImagePath
                    ? `http://localhost:8080/uploads/avatars/${v.mainImagePath}`
                    : "/images/broken-image.png"
                }
                alt={v.venueName}
                onClick={() => navigate(`/venue/${v.venueId}`)}
                sx={{ cursor: "pointer" }}
              />
              <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                <Typography gutterBottom variant="h6" component="div">
                  {v.venueName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Khu vực: {v.district?.districtName || "Chưa xác định"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Số sân: {v.totalCourts} sân
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Giá: {v.price ? `${v.price} VNĐ/giờ` : "Liên hệ"}
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ mt: 2 }}
                  onClick={() => navigate(`/venue/${v.venueId}`)}
                >
                  Đặt sân
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ============ VENUE LIST ============ */}
      <Typography variant="h4" component="h2" sx={{ textAlign: "center", mb: 3 }}>
        Danh sách sân bóng
      </Typography>
      <Grid container spacing={3} sx={{ mb: 5, justifyContent: 'center' }}>
        {venues.map((v) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={v.venueId}> {/* 4 cột trên lg (12/4=3) */}
            <Card
              sx={{
                maxWidth: 345,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={
                  v.mainImagePath
                    ? `http://localhost:8080/uploads/avatars/${v.mainImagePath}`
                    : "/images/broken-image.png"
                }
                alt={v.venueName}
                onClick={() => navigate(`/venue/${v.venueId}`)}
                sx={{ cursor: "pointer" }}
              />
              <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                <Typography gutterBottom variant="h6" component="div">
                  {v.venueName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Khu vực: {v.address || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Số sân: {v.totalCourts} sân
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Giá: {v.price ? `${v.price} VNĐ/giờ` : "Liên hệ"}
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ mt: 2 }}
                  onClick={() => navigate(`/venue/${v.venueId}`)}
                >
                  Đặt sân
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
}

export default VenueList;