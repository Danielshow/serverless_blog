import React, { Component } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import BlogaNavbar from '../components/BlogaNavbar';
import { createBlog } from '../api/blogs-api'
import {
  Input,
} from 'semantic-ui-react'
import { Dimmer, Loader } from 'semantic-ui-react'
import { Button } from 'reactstrap';

class NewBlog extends Component{
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      title: '',
      loading: false,
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
    this.setState({ loading: true });
    const { title } = this.state;
    const rawContentState = convertToRaw(
      this.state.editorState.getCurrentContent()
    );
    console.log(rawContentState, "REQ");
    createBlog(this.props.auth.idToken, {title, content: rawContentState}).then(() => {
      this.setState({ loading: false });
      this.props.history.push('/blogs/mine');
    }).catch(() => {
      this.setState({ loading: false });
    });
  }

  render() {
    const { editorState, loading } = this.state;
    return (
      <>
      { loading && (
        <Dimmer active>
          <Loader size='massive'>Loading</Loader>
        </Dimmer>
      )}
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
    )
  }
}

export default NewBlog;