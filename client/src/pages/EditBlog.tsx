import * as React from "react";
import { Form } from "semantic-ui-react";
import Auth from "../auth/Auth";
import { getUploadUrl, uploadFile } from "../api/blogs-api";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import BlogaNavbar from "../components/BlogaNavbar";
import { patchBlog } from "../api/blogs-api";
import { Input } from "semantic-ui-react";
import { Dimmer, Loader } from "semantic-ui-react";
import { Button } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile
}

interface EditBlogProps {
  match: {
    params: {
      blogId: string;
    };
  };
  auth: Auth;
  history: any;
  handleLogin: () => void;
  handleLogout: () => void;
}

interface EditBlogState {
  file: any;
  uploadState: UploadState;
  editorState: EditorState;
  title: string;
  loading: boolean;
}

export class EditBlog extends React.PureComponent<
  EditBlogProps,
  EditBlogState
> {
  state: EditBlogState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    editorState: EditorState.createEmpty(),
    title: "",
    loading: false
  };

  componentDidMount() {
    if (!this.props.auth.isAuthenticated()) {
      this.props.history.push("/");
    }
    const contentState = convertFromRaw(
      JSON.parse(this.props.history.location.state.blog.content)
    );
    const editorState = EditorState.createWithContent(contentState);
    this.setState({
      editorState: editorState,
      title: this.props.history.location.state.blog.title
    });
  }
  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    this.setState({
      file: files[0]
    });
  };

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
      if (!this.state.file) {
        alert("File should be selected");
        return;
      }

      this.setUploadState(UploadState.FetchingPresignedUrl);
      const uploadUrl = await getUploadUrl(
        this.props.auth.getIdToken(),
        this.props.match.params.blogId
      );

      this.setUploadState(UploadState.UploadingFile);
      await uploadFile(uploadUrl, this.state.file);

      toast('🦄 File was uploaded');
    } catch (e) {
      toast.error('🦄 Could not upload file');
    } finally {
      this.setUploadState(UploadState.NoUpload);
    }
  };

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    });
  }

  onEditorStateChange = (editorState: EditorState) => {
    this.setState({
      editorState
    });
  };

  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ title: event.target.value });
  };

  updateBlog = (event: any) => {
    event.preventDefault();
    this.setState({ loading: true });
    const { title } = this.state;
    const rawContentState = convertToRaw(
      this.state.editorState.getCurrentContent()
    );
    patchBlog(this.props.auth.idToken, this.props.match.params.blogId, { title, content: JSON.stringify(rawContentState), published: this.props.history.location.state.blog.published}).then(() => {
      this.setState({ loading: false });
      console.log("Blog updated");
      this.props.history.push('/blogs/mine');
    }).catch(() => {
      toast.error('🦄 Could not update blog');
      this.setState({ loading: false });
    });
  };

  render() {
    console.log("host", this.props.history);
    return (
      <div className="wrapper">
        {this.state.loading && (
          <Dimmer active>
            <Loader size="massive">Loading</Loader>
          </Dimmer>
        )}
        <BlogaNavbar {...this.props} />
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
        <div className="blog-header">
          <div className="container mt-4 editor-color">
            <h3>Upload new image</h3>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <label>File</label>
                <input
                  type="file"
                  accept="image/*"
                  placeholder="Image to upload"
                  onChange={this.handleFileChange}
                />
              </Form.Field>

              {this.renderButton()}
            </Form>
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
              editorState={this.state.editorState}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              onEditorStateChange={this.onEditorStateChange}
              placeholder="Enter blog content..."
            />
            <Button onClick={this.updateBlog}>Update Blog</Button>
          </div>
        </div>
      </div>
    );
  }

  renderButton() {
    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && (
          <p>Uploading image metadata</p>
        )}
        {this.state.uploadState === UploadState.UploadingFile && (
          <p>Uploading file</p>
        )}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    );
  }
}
