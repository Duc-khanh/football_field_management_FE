"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Rating,
} from "@mui/material"
import FavoriteIcon from "@mui/icons-material/Favorite"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"


// --- Hàm giải mã JWT ---
function decodeJwt(token) {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
    return JSON.parse(jsonPayload)
  } catch (err) {
    return null
  }
}

function getAccountIdFromToken() {
  const token = localStorage.getItem("authToken")
  if (!token) return null
  const payload = decodeJwt(token)
  return payload ? payload.sub || payload.id || payload.accountId : null
}

function VenueList({ searchKeyword }) {
  const [venues, setVenues] = useState([])
  const [favorites, setFavorites] = useState([])
  const [visibleCount, setVisibleCount] = useState(8)
  const navigate = useNavigate()

  const token = localStorage.getItem("authToken")
  const accountId = getAccountIdFromToken()

  // Load danh sách sân
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/home?size=200")
      .then((res) => {
        const list = res.data.content || res.data || []
        if (Array.isArray(list)) setVenues(list)
      })
      .catch((err) => console.error("Lỗi load venues:", err))
  }, [])

  // Load danh sách yêu thích
  useEffect(() => {
    if (accountId && token) {
      axios
        .get(`http://localhost:8080/api/home/favorite/list?accountId=${accountId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (typeof res.data === "string" && res.data.includes("<!DOCTYPE html>")) {
            console.error("⚠️ Token hết hạn, server trả về trang Login.")
            return
          }

          let dataArray = []
          if (Array.isArray(res.data)) {
            dataArray = res.data
          } else if (res.data && Array.isArray(res.data.content)) {
            dataArray = res.data.content
          }

          const likedIds = dataArray.map((v) => v.venueId || v.id)
          setFavorites(likedIds)
        })
        .catch((err) => {
          console.error("❌ Lỗi gọi API Favorite:", err)
          setFavorites([])
        })
    }
  }, [accountId, token])

  // Toggle yêu thích
  const handleToggleFavorite = async (venueId) => {
    if (!accountId) {
      alert("Bạn cần đăng nhập!")
      navigate("/auth/login")
      return
    }

    try {
      const res = await axios.post(
        `http://localhost:8080/api/home/favorite/toggle/${venueId}?accountId=${accountId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const isAdded = res.data
      if (isAdded) {
        setFavorites((prev) => [...prev, venueId])
      } else {
        setFavorites((prev) => prev.filter((id) => id !== venueId))
      }
    } catch (err) {
      console.error("Lỗi toggle:", err)
    }
  }

  const displayVenues = searchKeyword
    ? venues.filter((v) => v.venueName.toLowerCase().includes(searchKeyword.toLowerCase()))
    : venues

  // Dữ liệu đánh giá mẫu
  const sampleReviews = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "/images/avatar1.jpg",
      rating: 5,
      comment: "Sân bóng rất chất lượng, dịch vụ tốt, sẽ quay lại lần sau!",
    },
    {
      id: 2,
      name: "Trần Thị B",
      avatar: "/images/avatar2.jpg",
      rating: 4,
      comment: "Giá cả hợp lý, sân sạch sẽ và tiện nghi đầy đủ.",
    },
    {
      id: 3,
      name: "Lê Văn C",
      avatar: "/images/avatar3.jpg",
      rating: 5,
      comment: "Đặt sân dễ dàng qua app, nhân viên thân thiện.",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      avatar: "/images/avatar4.jpg",
      rating: 4,
      comment: "Sân bóng đẹp, ánh sáng tốt, phù hợp cho các trận đấu.",
    },
  ]

  // DỮ LIỆU HỢP TÁC & ĐẦU TƯ
  const partnershipData = [
    {
      id: 1,
      title: "6 bước đầu tư kinh doanh sân bóng đá hiệu quả",
      description:
        "Đầu tư sân bóng là kênh an toàn tạo thu nhập thụ động, đặc biệt với người có quỹ đất.",
      image:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj15pIDK5-xBX8Rb-iGtInL1GV_cIDbUxNXONCR9MkHaiSetAx1GxZxKPxM4OjwJIRKJKFJnw1i71gSUcNdDZxs0Ai1hjaVP2S612AfIDc7EqPx90xfUyvmInhALHTwv8swZoEa2UkvbbwvgPKwP9NGj6c3l9rvHKKEgC1Bq36gVT2SHtj1GsTr4IoUQPo/s600-rw/(%20Anhpnng.com%20)%20-%20BONG-DA%20(109).jpg",
      features: ["Lựa chọn địa điểm tốt", "Thiết kế sân hiện đại", "Quản lý chi phí"],
      icon: EmojiEventsIcon,
    },
    {
      id: 2,
      title: "Hạch toán chi phí làm sân bóng nhân tạo 7 người",
      description:
        "Cỏ nhân tạo bền bỉ, chi phí bảo dưỡng thấp — phù hợp đầu tư dài hạn.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX27gAe0dVuYxQrhzQRF4D8FVScjIo86x88w&s",
      features: ["Chi phí xây dựng", "Vật tư chất lượng", "Thợ chuyên nghiệp"],
      icon: TrendingUpIcon,
    },
    {
      id: 3,
      title: "Chi phí đầu tư sân bóng đá tiêu chuẩn",
      description:
        "Bóng đá đang phổ biến mạnh tại Việt Nam — cơ hội đầu tư lớn.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOCXgY-gFmMO6ICQql4jO6cYlh-m2zrcDr7g&s",
      features: ["Tiêu chuẩn quốc tế", "Bảo trì lâu dài", "Thu nhập ổn định"],
      icon: CheckCircleIcon,
    },
    {
      id: 4,
      title: "Lợi nhuận từ kinh doanh sân bóng ",
      description:
        "Bóng đá phát triển nhanh, nhu cầu thuê sân tăng liên tục.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb1NzhIOon9AO6GfnPB9Z_Yl88Y8NU6njffA&s",
      features: ["Nhu cầu cao", "Vị trí chiến lược", "Doanh thu tăng trưởng"],
      icon: TrendingUpIcon,
    },
  ]

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" textAlign="center" mb={3}>
        Danh sách sân bóng
      </Typography>

      {/* LIST SÂN */}
      <Grid container spacing={3} justifyContent="center">
        {displayVenues.slice(0, visibleCount).map((v) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={v.venueId}>
            <Card
              sx={{
                maxWidth: 345,
                position: "relative",
                "&:hover": { transform: "scale(1.02)" },
                transition: "0.2s",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <IconButton
                onClick={() => handleToggleFavorite(v.venueId)}
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  zIndex: 10,
                  backgroundColor: "rgba(255,255,255,0.8)",
                }}
              >
                {favorites.includes(v.venueId) ? (
                  <FavoriteIcon sx={{ color: "red" }} />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>

              <CardMedia
                component="img"
                height="200"
                image={
                  v.mainImagePath
                    ? `http://localhost:8080/uploads/avatars/${v.mainImagePath}`
                    : "/images/broken-image.png"
                }
                alt={v.venueName}
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/venue/${v.venueId}`)}
              />

              <CardContent>
                <Typography variant="h6" noWrap>
                  {v.venueName}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {v.address}
                </Typography>
                <Typography variant="body2" mt={1}>
                  Số sân: <b>{v.totalCourts || 0}</b>
                </Typography>
                <Typography variant="body2" color="primary">
                  Giá: {v.price ? v.price.toLocaleString() : "Liên hệ"} VNĐ/h
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => navigate(`/venue/${v.venueId}`)}
                >
                  Chi tiết
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {visibleCount < displayVenues.length && (
        <Box textAlign="center" mt={3}>
          <Button variant="outlined" onClick={() => setVisibleCount((prev) => prev + 8)}>
            Xem thêm
          </Button>
        </Box>
      )}

      {/* --- HỢP TÁC & ĐẦU TƯ --- */}
      <Box sx={{ mt: 8, py: 6, backgroundColor: "#fafafa", borderRadius: 2 }}>
        <Typography variant="h4" textAlign="center" mb={4}>
          Hợp tác & Đầu tư
        </Typography>

        <Grid container spacing={3}>
          {partnershipData.map((item) => {
            const IconComponent = item.icon
            return (
              <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }} key={item.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "12px",
                    overflow: "hidden",
                    transition: "0.3s",
                    "&:hover": { boxShadow: "0 8px 24px rgba(0,0,0,0.15)" },
                  }}
                >
                  <Box sx={{ position: "relative", height: 200 }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.image}
                      alt={item.title}
                      sx={{ transition: "0.3s", "&:hover": { transform: "scale(1.05)" } }}
                    />

                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                        color: "white",
                        p: 2,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: "600", fontSize: "14px" }}>
                        {item.title}
                      </Typography>
                    </Box>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {item.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      {item.features.map((feature, idx) => (
                        <Box key={idx} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <IconComponent sx={{ fontSize: 18, color: "#e74c3c", mr: 1 }} />
                          <Typography variant="caption">{feature}</Typography>
                        </Box>
                      ))}
                    </Box>

                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        mt: "auto",
                        backgroundColor: "#e74c3c",
                        "&:hover": { backgroundColor: "#c0392b" },
                      }}
                    >
                      Tìm hiểu thêm
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Box>

      {/* --- ĐÁNH GIÁ --- */}
      <Box sx={{ mt: 6, py: 4, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
        <Typography variant="h5" textAlign="center" mb={3}>
          Đánh giá từ khách hàng
        </Typography>

        <Grid container spacing={3}>
          {sampleReviews.map((review) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={review.id}>
              <Card
                sx={{
                  p: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar src={review.avatar} sx={{ width: 56, height: 56, mb: 2 }} />
                <Typography variant="h6">{review.name}</Typography>
                <Rating value={review.rating} readOnly sx={{ mb: 1 }} />
                <Typography variant="body2" textAlign="center" color="text.secondary">
                  "{review.comment}"
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

     {/* --- KẾT NỐI VỚI THẾ GIỚI THỂ THAO + GOOGLE MAP --- */}
<Box sx={{ mt: 8 }}>
  <Typography variant="h4" fontWeight="bold" mb={3}>
    Kết nối với Thế Giới Thể Thao
  </Typography>

  <Grid container spacing={3}>
    {/* LEFT BOX */}
    <Grid item xs={12} md={4}> 
      <Box
        sx={{
          border: "1px solid #eee",
          p: 3,
          borderRadius: 2,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Hà Nội
        </Typography>

        <Typography sx={{ mb: 1 }}>
          📍 Số 56 Đặng Thùy Trâm – Phường Nghĩa Đô – Hà Nội{" "}
          <span style={{ color: "red" }}>(Google Map)</span>
        </Typography>

        <Typography sx={{ mb: 1 }}>
          ☎ Điện thoại: <b style={{ color: "red" }}>0335.088.588</b>
        </Typography>

        <Typography sx={{ mb: 1 }}>
          ✉ Mail: <b>duckhanh@thegioithethao.vn</b>
        </Typography>

        <Typography>
          📱 Hotline (Zalo):{" "}
          <b style={{ color: "red" }}>0335.088.588</b>
        </Typography>
      </Box>
    </Grid>

    {/* RIGHT GOOGLE MAP */}
    <Grid item xs={12} md={8}>
      <Box
        sx={{
          width: "100%",
          height: 400,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.7950155117976!2d105.7900892748706!3d21.040395887451683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4c82d5b8f9%3A0xa4a4c7c2d0a73e7b!2zNTYgxJAuIMSQ4bqhbmcgVGh1eSBUcsOibSwgUGjGsOG7nW5nIE5naMSpYSDEkOG7kW8sIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1708369870003"
        ></iframe>
      </Box>
    </Grid>
  </Grid>
</Box>

    </Container>
  )
}

export default VenueList
