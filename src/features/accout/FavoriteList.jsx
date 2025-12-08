import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container, Grid, Card, CardMedia, CardContent, Typography, Button, Box
} from "@mui/material";

// --- Hàm giải mã JWT ---
function decodeJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64).split("").map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    return null;
  }
}

function getAccountIdFromToken() {
  const token = localStorage.getItem("authToken");
  if (!token) return null;
  const payload = decodeJwt(token);
  return payload ? (payload.sub || payload.id || payload.accountId) : null;
}

function FavoriteList() {
  // Khởi tạo luôn là mảng rỗng
  const [favorites, setFavorites] = useState([]); 
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");
  const accountId = getAccountIdFromToken();

  useEffect(() => {
    if (!accountId) {
      // Nếu chưa login thì không gọi API, tránh lỗi
      return; 
    }

    axios.get(`http://localhost:8080/api/home/favorite/list?accountId=${accountId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      console.log("🔥 API Response:", res.data); // Xem log này để biết API trả về gì

      // Logic ép kiểu dữ liệu chặt chẽ
      if (Array.isArray(res.data)) {
         setFavorites(res.data);
      } 
      else if (res.data && Array.isArray(res.data.content)) {
         setFavorites(res.data.content); // Trường hợp trả về Page
      } 
      else {
         console.warn("API không trả về mảng, set về rỗng.");
         setFavorites([]); // Nếu không phải mảng, ép về rỗng ngay
      }
    })
    .catch((err) => {
      console.error("Lỗi API:", err);
      setFavorites([]); // Gặp lỗi ép về rỗng
    });
  }, [accountId, token]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" textAlign="center" mb={3}>
        Sân bóng yêu thích của tôi
      </Typography>

      {/* --- SỬA LOGIC RENDER TẠI ĐÂY --- */}
      {/* Chỉ render khi favorites thực sự là Array và có phần tử */}
      
      {!Array.isArray(favorites) || favorites.length === 0 ? (
        <Box textAlign="center" mt={5}>
          <Typography variant="h6" color="text.secondary">
            Bạn chưa có sân yêu thích nào.
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/")}>
            Khám phá sân ngay
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {favorites.map((v) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={v.venueId || Math.random()}>
              <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={v.mainImagePath ? `http://localhost:8080/uploads/avatars/${v.mainImagePath}` : "/images/broken-image.png"}
                  alt={v.venueName || "Sân bóng"}
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate(`/venue/${v.venueId}`)}
                />
                <CardContent>
                  <Typography variant="h6" noWrap>{v.venueName}</Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>{v.address}</Typography>
                  <Typography variant="body2" color="primary" mt={1}>
                     Giá: {v.price ? v.price.toLocaleString() : 0} VNĐ/h
                  </Typography>
                  
                  <Button 
                    fullWidth 
                    variant="contained" 
                    sx={{ mt: 2 }} 
                    onClick={() => navigate(`/venue/${v.venueId}`)}
                  >
                    Đặt ngay
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default FavoriteList;