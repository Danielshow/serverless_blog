import React, { Component } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import BlogaNavbar from "../components/BlogaNavbar";
import { createBlog } from "../api/blogs-api";
import { Input } from "semantic-ui-react";
import { Dimmer, Loader } from "semantic-ui-react";
import { Button } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";

class NewBlog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      title: "",
      loading: false
    };
  }

  componentDidMount() {
    if (!this.props.auth.isAuthenticated()) {
      this.props.history.push("/");
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState
    });
  };

  handleTitleChange = (event) => {
    this.setState({ title: event.target.value });
  };

  saveBlog = async (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const { title } = this.state;
    if (!title.trim()) {
      toast.error("🦄 Please enter a title");
      this.setState({ loading: false });
      return;
    }
    const rawContentState = convertToRaw(
      this.state.editorState.getCurrentContent()
    );
    console.log("oops", rawContentState)
    if (!this.state.editorState.getCurrentContent().hasText()) {
      toast.error("🦄 Blog cannot be empty");
      this.setState({ loading: false });
      return
    }
    createBlog(this.props.auth.idToken, { title, content: rawContentState })
      .then(() => {
        this.setState({ loading: false });
        this.props.history.push("/blogs/mine");
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  render() {
    const { editorState, loading } = this.state;
    return (
      <>
        {loading && (
          <Dimmer active>
            <Loader size="massive">Loading</Loader>
          </Dimmer>
        )}
        <div className="wrapper">
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
          <BlogaNavbar {...this.props} />
          <div className="blog-header">
            <div className="container mt-4 editor-color">
              <div>
                <Input
                  fluid
                  actionPosition="left"
                  placeholder="Enter blog title..."
                  onChange={this.handleTitleChange}
                  value={this.state.title}
                  required
                />
              </div>
              <Editor
                editorState={editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={this.onEditorStateChange}
                placeholder="Enter blog content..."
              />
              <Button onClick={this.saveBlog}>Save Blog</Button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default NewBlog;
