import { CCarousel, CCarouselItem, CImage } from '@coreui/react';
import image1 from './../images/homepage_slides.gif';
import { Link } from 'react-router-dom';

export default function MainDashboard() {
  return (
    <div>
      {/* Carousel Section */}
      <div className="container mt-4">
        <CCarousel controls>
          <CCarouselItem>
            <CImage className="rounded rounded-5 d-block w-100" src={image1} alt="slide 1" />
          </CCarouselItem>
          <CCarouselItem>
            <CImage className="rounded rounded-5 d-block w-100" src={image1} alt="slide 2" />
          </CCarouselItem>
          <CCarouselItem>
            <CImage className="rounded rounded-5 d-block w-100" src={image1} alt="slide 3" />
          </CCarouselItem>
        </CCarousel>
        {/* Buttons Section */}
        <div className="d-flex gap-5 my-4 justify-content-center flex-wrap mt-5">
          <Link to="/pag" className="btn btn-primary py-2 px-4">
            Product Audit
          </Link>
          <Link to="/pdi" className="btn btn-primary  py-2 px-4">
            PDI Check
          </Link>
          <Link to="/qg" className="btn btn-primary py-2 px-4">
            Quality Gates
          </Link>
          <Link to="/pr" className="btn btn-primary py-2 px-4">
            Post Rollout
          </Link>
        </div>
      </div>
    </div>
  );
}
