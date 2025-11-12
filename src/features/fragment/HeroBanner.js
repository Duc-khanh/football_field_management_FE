import { Link } from "react-router-dom"
import "./HeroBanner.css"

export default function HeroBanner() {
  return (
    <section className="hero-banner">
      <div className="hero-background">
        <img src="/modern-sports-field-stadium.jpg" alt="Hero Background" className="hero-image" />
      </div>

      <div className="hero-overlay"></div>

      <div className="hero-content">
        <div className="hero-text-group">
          <h1 className="hero-title">
            Tìm Sân Bóng <span className="text-accent">Hoàn Hảo</span>
          </h1>

          <p className="hero-subtitle">
            Khám phá hàng trăm sân bóng chất lượng cao tại thành phố. Đặt sân dễ dàng, nhanh chóng, chỉ trong vài thao
            tác.
          </p>

          <div className="hero-buttons">
            <Link to="/#venues" className="btn btn-primary">
              Khám phá ngay
            </Link>
            <Link to="/#contact" className="btn btn-secondary">
              Liên hệ tư vấn
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Sân bóng</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Người dùng</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Hỗ trợ</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
