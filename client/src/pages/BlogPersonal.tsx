import React, { useEffect, useState } from "react";
import BlogaNavbar from "../components/BlogaNavbar.js";
import { Button, Container, NavLink as NavB } from "reactstrap";
import Auth from "../auth/Auth"
import { getUserBlogs, deleteBlog, patchBlog } from '../api/blogs-api'
import { Blog } from '../types/Blog' 
import { Dimmer, Loader, Icon } from 'semantic-ui-react'
import BlogPage from '../components/BlogPage'
import { NavLink } from "react-router-dom";

interface BlogProps {
    auth: Auth
    history: any
    handleLogin: () => void
    handleLogout: () => void
  }
function BlogsPage(props: BlogProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [clickedBlog, setClickedBlog] = useState<Blog | null>(null);
  const [open, setOpen] = React.useState(false)

  useEffect(() => {
    if (!props.auth.isAuthenticated()) {
      props.history.push("/");
    }
  }, []);

  useEffect(() => {
    getUserBlogs(props.auth.idToken).then((blogs) => {
      setBlogs(blogs);
      setLoading(false);
    });
  }, []);

  const handleUpdate = (blog: Blog) => {
    props.history.push(`/blogs/${blog.blogId}`, { blog: blog });
  }

  const handleDelete = (blog: Blog) => {
    console.log("deleting blog", blog)
    setLoading(true);
    deleteBlog(props.auth.idToken, blog.blogId).then(() => {
      setBlogs(blogs.filter((b) => b.blogId !== blog.blogId));
      setLoading(false);
    });
  }

  const handlePublished = (blog: Blog) => {
    setLoading(true);
    patchBlog(props.auth.idToken, blog.blogId, { published: !blog.published, title: blog.title, content: blog.content }).then(() => {
      const updatedBlogs = blogs.map((b) => {
        if (b.blogId === blog.blogId) {
          blog.published = !blog.published;
          return blog;
        }
        return b;
      })
      setBlogs(updatedBlogs);
      setLoading(false);
    });
  }

  return (
    <>
      <BlogaNavbar {...props} />
      { loading && (
        <Dimmer active>
          <Loader size='massive'>Loading</Loader>
        </Dimmer>
      )}
      <div className="wrapper">
        <div className="page-header">
          <div className="content">
            <Container>
              <h1 className="title">Blogs</h1>
              <Button>
                <NavLink to="/blogs/new">New Blog</NavLink>
              </Button>
              <section className="cards-wrapper">
                { !blogs.length && (
                  <h3 className="center">No blogs found</h3>
                )}
                { blogs.map((blog: Blog) => {
                  return (
                    <div className="card-grid-space " key={blog.blogId}>
                      <NavB
                        className="card-blog"
                      >
                        <div>
                          <h1 className="custom-button"onClick={() => {
                          setClickedBlog(blog);
                          setOpen(true);
                          }}>{blog.title}</h1>
                          <p>
                            {blog.content.substring(0, 100)}
                          </p>
                          <div className="date">{blog.publishedAt ? new Date(blog.publishedAt).toUTCString() : 'Not published'}</div>
                          <Icon link name='pencil' onClick={() => {
                            handleUpdate(blog);
                          }} /> &nbsp;
                          <Icon link name='zip' onClick={() => {
                            handleDelete(blog);
                          }} /> &nbsp;
                          <Icon link disabled={blog.published} name='globe' onClick={() => {
                            handlePublished(blog);
                          }}/>

                        </div>
                      </NavB>
                    </div>
                  )
                })}
              </section>
              { clickedBlog && (<BlogPage blog={clickedBlog} open={open} setOpen={setOpen} />) }
            </Container>
          </div>
        </div>
      </div>
    </>
  );
}

export default BlogsPage;
