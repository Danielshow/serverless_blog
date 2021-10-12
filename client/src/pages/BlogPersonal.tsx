import React, { useEffect, useState } from "react";
import BlogaNavbar from "../components/BlogaNavbar.js";
import { Button, Container, NavLink } from "reactstrap";
import Auth from "../auth/Auth"
import { getUserBlogs } from '../api/blogs-api'
import { Blog } from '../types/Blog' 
import { Dimmer, Loader, Modal } from 'semantic-ui-react'
import BlogPage from '../components/BlogPage'

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
                <NavLink href="/blogs/new">New Blog</NavLink>
              </Button>
              <section className="cards-wrapper">
                { !blogs.length && (
                  <h3 className="center">No blogs found</h3>
                )}
                { blogs.map((blog: Blog) => {
                  return (
                    <div className="card-grid-space" key={blog.blogId}>
                      <NavLink
                        onClick={() => {
                          setClickedBlog(blog);
                          setOpen(true);
                        }}
                        className="card-blog"
                      >
                        <div>
                          <h1>{blog.title}</h1>
                          <p>
                            {blog.content.substring(0, 100)}
                          </p>
                          <div className="date">{blog.publishedAt}</div>
                        </div>
                      </NavLink>
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
