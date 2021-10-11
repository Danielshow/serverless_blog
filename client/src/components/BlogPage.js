// import React from 'react'
// import { Button, Header, Icon, Modal } from 'semantic-ui-react'

// function BlogPage(props) {
//   const { blog } = props;
//   return (
//     <Modal
//       basic
//       onClose={() => props.setOpen(false)}
//       onOpen={() => props.setOpen(true)}
//       open={props.open}
//     >
//       <Header icon>
//         {blog.title}
//       </Header>
//       <Modal.Content scrolling>
//         <p>
//           {blog.content}
//         </p>
//       </Modal.Content>
//       <Modal.Actions>
//         <Button basic color='red' inverted onClick={() => props.setOpen(false)}>
//           <Icon name='remove' /> Close
//         </Button>
//       </Modal.Actions>
//     </Modal>
    
//   )
// }


import React, { useEffect, useRef } from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react'

const BlogPage = ({ blog, open, setOpen }) => {
    const modalRef = useRef(null);
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
                    <p>
                      {blog.content}
                    </p>
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