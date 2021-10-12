import React, { useEffect, useRef } from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react'
import { EditorState, convertFromRaw } from "draft-js";
import { stateToHTML } from 'draft-js-export-html';

const BlogPage = ({ blog, open, setOpen }) => {
    const modalRef = useRef(null);
    const contentState = convertFromRaw(JSON.parse(blog.content));
    const editorState = stateToHTML(EditorState.createWithContent(contentState).getCurrentContent());
    useEffect(
        () => {
            if (open) {
                modalRef.current.classList.add('visible');
            }
            else {
                modalRef.current.classList.remove('visible');
            }
        },
        [
            open
        ]
    );
    return (
        <React.Fragment>
            <div ref={modalRef} className='modal__wrap'>
                <div className='modal'>
                  <Header icon>
                    {blog.title}
                  </Header>
                  <Modal.Content scrolling>
                    <div dangerouslySetInnerHTML={{__html: editorState}} />
                  </Modal.Content>
                </div>
                <Button basic color='red' inverted onClick={() => setOpen(false)}>
                <Icon name='remove' /> Close
              </Button>
            </div>
        </React.Fragment>
    );
};

export default BlogPage