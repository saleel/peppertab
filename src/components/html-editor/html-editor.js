import React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import CKEditorBuild from '@saleel/ckeditor5-build-balloon-base64';
import './html-editor.scss';


function HtmlEditor(props, ref) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <CKEditor ref={ref} editor={CKEditorBuild} {...props} />
  );
}


export default React.forwardRef(HtmlEditor);
