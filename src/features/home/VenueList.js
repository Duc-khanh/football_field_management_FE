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
  Box,
} from "@mui/material";

function VenueList({ searchKeyword }) {
  const [venues, setVenues] = useState([]);            // danh sách hiển thị
  const [venuesBackup, setVenuesBackup] = useState([]); // danh sách gốc để search
  const [visibleCount, setVisibleCount] = useState(8); // mặc định 8 sân

  const navigate = useNavigate();

  useEffect(() => {
    loadVenues();
  }, []);

  // 🔍 Tự động lọc khi keyword thay đổi
  useEffect(() => {
    if (!searchKeyword || searchKeyword.trim() === "") {
      setVenues(venuesBackup);
      setVisibleCount(8);
      return;
    }

    const filtered = venuesBackup.filter((v) =>
      v.venueName.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    setVenues(filtered);
    setVisibleCount(8);

  }, [searchKeyword, venuesBackup]);

  const loadVenues = () => {
    axios
      .get("http://localhost:8080/api/home?size=200") // lấy nhiều để show more
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.content || [];
        setVenues(list);
        setVenuesBackup(list);
      })
      .catch((err) => console.error(err));
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h2" sx={{ textAlign: "center", mb: 3 }}>
        Danh sách sân bóng
      </Typography>

      {/* Danh sách sân */}
      <Grid container spacing={3} sx={{ mb: 5, justifyContent: "center" }}>
        {venues.slice(0, visibleCount).map((v) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={v.venueId}>
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

      {/* NÚT XEM THÊM */}
      {visibleCount < venues.length && (
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Button
            variant="outlined"
            onClick={handleShowMore}
            sx={{
              borderRadius: "50%",
              width: 60,
              height: 60,
              fontSize: "24px",
            }}
          >
            ↓
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default VenueList;
