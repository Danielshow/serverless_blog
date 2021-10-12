import React, { useEffect, useState } from "react";
import BlogaNavbar from "../components/BlogaNavbar.js";
import { Button, Container, NavLink as NavB } from "reactstrap";
import Auth from "../auth/Auth";
import { getUserBlogs, deleteBlog, patchBlog } from "../api/blogs-api";
import { Blog } from "../types/Blog";
import { Dimmer, Loader, Icon } from "semantic-ui-react";
import BlogPage from "../components/BlogPage";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

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
    if (!props.auth.isAuthenticated()) {
      props.history.push("/");
    }
  }, []);

  useEffect(() => {
    getUserBlogs(props.auth.getIdToken()).then((blogs) => {
      setBlogs(blogs);
      setLoading(false);
    });
  }, []);

  const handleUpdate = (blog: Blog) => {
    props.history.push({
      pathname: `/blogs/edit/${blog.blogId}`,
      state: { blog: blog }
    });
  };

  const handleDelete = (blog: Blog) => {
    console.log("deleting blog", blog);
    setLoading(true);
    deleteBlog(props.auth.getIdToken(), blog.blogId)
      .then(() => {
        setBlogs(blogs.filter((b) => b.blogId !== blog.blogId));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error("🦄 Error deleting Blog", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
      });
  };

  const handlePublished = (blog: Blog) => {
    setLoading(true);
    console.log("publishing blog", blog.content);
    patchBlog(props.auth.getIdToken(), blog.blogId, {
      published: !blog.published,
      title: blog.title,
      content: blog.content
    })
      .then(() => {
        const updatedBlogs = blogs.map((b) => {
          if (b.blogId === blog.blogId) {
            blog.published = !blog.published;
            blog.publishedAt = blog.published ? new Date().toISOString() : "";
            return blog;
          }
          return b;
        });
        setBlogs(updatedBlogs);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        toast.error("🦄 Error publishing Blog", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
      });
  };

  return (
    <>
      <BlogaNavbar {...props} />
      {loading && (
        <Dimmer active>
          <Loader size="massive">Loading</Loader>
        </Dimmer>
      )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="wrapper">
        <div className="blog-header">
          <div className="content">
            <Container>
              <h1 className="title">Blogs</h1>
              <Button>
                <NavLink to="/blogs/new">New Blog</NavLink>
              </Button>
              <section className="cards-wrapper">
                {!blogs.length && <h3 className="center">No blogs found</h3>}
                {blogs.map((blog: Blog) => {
                  const parsedBlog = JSON.parse(blog.content);
                  return (
                    <div className="card-grid-space " key={blog.blogId}>
                      <div className="card-blog-2">
                        <figure className="card__thumbnail">
                          <img src={ blog.attachmentUrl || "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ"} alt="Blog"/>
                          <div className="published_date">
                            {blog.publishedAt
                              ? new Date(blog.publishedAt).toUTCString()
                              : "Not published"}
                          </div>
                          <span className="card__icons">
                            <Icon
                              link
                              name="pencil"
                              onClick={() => {
                                handleUpdate(blog);
                              }}
                            />{" "}
                            &nbsp;
                            <Icon
                              link
                              name="zip"
                              onClick={() => {
                                handleDelete(blog);
                              }}
                            />{" "}
                            &nbsp;
                            <Icon
                              link
                              disabled={blog.published}
                              name="globe"
                              onClick={() => {
                                handlePublished(blog);
                              }}
                            />
                          </span>
                          <span className="card__title" onClick={() => {
                            setClickedBlog(blog);
                            setOpen(true);
                          }}>{blog.title}</span>
                          <span className="card__description"> {parsedBlog.blocks[0].text.substring(0, 20)}... </span>
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
