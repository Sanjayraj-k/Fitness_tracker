import React from 'react';
import './Blog.css';

const BlogGrid = () => {
  const blogs = [
    {
      id: 1,
      title: "Beginner's Guide to Strength Training",
      excerpt: "Learn where to start with strength training, fundamental movements, and a sample 4-week routine.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      category: "Training",
      date: "May 15, 2023",
      readTime: "8 min read",
      link: "https://www.drworkout.fitness/8-week-strength-building-workout-program-for-beginners/"
    },
    {
      id: 2,
      title: "The Science of Muscle Growth",
      excerpt: "Understand how muscles grow and how to maximize hypertrophy with proper training techniques.",
      image: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      category: "Science",
      date: "June 2, 2023",
      readTime: "10 min read",
      link: "https://www.builtlean.com/muscles-grow/"
    },
    {
      id: 3,
      title: "Home Workout Revolution",
      excerpt: "Build strength without a gym using bodyweight exercises and minimal equipment.",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      category: "Home Training",
      date: "June 18, 2023",
      readTime: "6 min read",
      link: "https://www.homeworkoutrevolution.com/"
    },
    {
      id: 4,
      title: "Pre- and Post-Workout Nutrition",
      excerpt: "What the research says about fueling your workouts and optimizing recovery.",
      image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      category: "Nutrition",
      date: "July 5, 2023",
      readTime: "12 min read",
      link: "https://www.eatright.org/fitness/physical-activity/exercise-nutrition/timing-your-pre-and-post-workout-nutrition"
    },
    {
      id: 5,
      title: "The 15-Minute Workout",
      excerpt: "Science-backed short but effective routines for when you're pressed for time.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      category: "Time-Saving",
      date: "July 22, 2023",
      readTime: "5 min read",
      link: "https://barbend.com/15-minute-workouts/"
    },
    {
      id: 6,
      title: "Mobility Matters",
      excerpt: "Why flexibility training shouldn't be skipped in your fitness routine.",
      image: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      category: "Recovery",
      date: "August 10, 2023",
      readTime: "9 min read",
      link: "https://barbend.com/best-mobility-exercises/"
    }
  ];

  // Function to handle clicking the Read Article button
  const handleReadArticle = (link) => {
    // Check if link exists
    if (link) {
      // Open the link in a new tab
      window.open(link, '_blank', 'noopener noreferrer');
    } else {
      // If no link is provided, show an alert or handle accordingly
      alert('Article link not available');
    }
  };

  return (
    <div className="blog-container">
      <header className="blog-header">
        <h1>Fitness Blog</h1>
        <p>Expert advice, training tips, and the latest fitness research</p>
      </header>
      
      <div className="blog-grid">
        {blogs.map((blog) => (
          <article key={blog.id} className="blog-card">
            <div className="blog-image-container">
              <img
                src={blog.image}
                alt={blog.title}
                className="blog-image"
                loading="lazy"
              />
              <span className="blog-category">{blog.category}</span>
            </div>
            <div className="blog-content">
              <h2>{blog.title}</h2>
              <p className="blog-excerpt">{blog.excerpt}</p>
              <div className="blog-meta">
                <span>{blog.date}</span>
                <span>•</span>
                <span>{blog.readTime}</span>
              </div>
              <button 
                className="read-more-btn"
                onClick={() => handleReadArticle(blog.link)}
              >
                Read Article
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogGrid;