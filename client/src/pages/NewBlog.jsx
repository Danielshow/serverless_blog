import React, { Component } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import BlogaNavbar from '../components/BlogaNavbar';
import { createBlog } from '../api/blogs-api'
import {
  Input,
} from 'semantic-ui-react'
import { Button } from 'reactstrap';

class NewBlog extends Component{
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      title: ''
    };
  }

  componentDidMount() {
    if (!this.props.auth.isAuthenticated()) {
      this.props.history.push('/');
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  handleTitleChange = (event) => {
    this.setState({ title: event.target.value })
  }

  saveBlog = async (event) => {
    event.preventDefault();
    const { title, editorState } = this.state;
    await createBlog(this.props.auth.idToken, {title, content: editorState});
    this.props.history.push('/blogs/mine');
  }

  render() {
    const { editorState } = this.state;
    return (
      <>
       <div className="wrapper">
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
    )
  }
}

export default NewBlog;