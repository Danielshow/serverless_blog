import React, { useEffect, useState } from "react";
import BlogaNavbar from "../components/BlogaNavbar.js";
import { Button, Container, NavLink } from "reactstrap";
import Auth from "../auth/Auth";
import { getBlogs } from "../api/blogs-api";
import { Blog } from "../types/Blog";
import { Link } from "react-router-dom";
import { Dimmer, Loader, Modal } from "semantic-ui-react";
import BlogPage from "../components/BlogPage";

interface BlogProps {
  auth: Auth;
  history: any;
  handleLogin: () => void;
  handleLogout: () => void;
}

function BlogsPage(props: BlogProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [clickedBlog, setClickedBlog] = useState<Blog | null>(null);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    getBlogs().then((blogs) => {
      setBlogs(blogs);
      setLoading(false);
    });
  }, []);
  return (
    <>
      <BlogaNavbar {...props} />
      {loading && (
        <Dimmer active>
          <Loader size="massive">Loading</Loader>
        </Dimmer>
      )}
      <div className="wrapper">
        <div className="page-header">
          <div className="content">
            <Container>
              <h1 className="title">Blogs</h1>
              <section className="cards-wrapper">
                {blogs.map((blog: Blog) => {
                  const parsedBlog = JSON.parse(blog.content);
                  return (
                    <div className="card-grid-space " key={blog.blogId}>
                      <div className="card-blog-2">
                        <figure className="card__thumbnail">
                          <img
                            src={
                              blog.attachmentUrl ||
                              "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
                            }
                          />
                          <div className="published_date">
                            {blog.publishedAt
                              ? new Date(blog.publishedAt).toUTCString()
                              : "Not published"}
                          </div>
                          <span className="card__title">{blog.title}</span>
                          <span className="card__description">
                            {" "}
                            {parsedBlog.blocks[0].text.substring(0, 20)}...{" "}
                          </span>
                        </figure>
                      </div>
                    </div>
                  );
                })}
              </section>
              {clickedBlog && (
                <BlogPage blog={clickedBlog} open={open} setOpen={setOpen} />
              )}
            </Container>
          </div>
        </div>
      </div>
    </>
  );
}

export default BlogsPage;
