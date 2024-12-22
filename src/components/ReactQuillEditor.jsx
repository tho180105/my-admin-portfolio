import ImageResize from "quill-image-resize-module-react";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef
} from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { quillFormats } from "../const/config";

ReactQuill.Quill.register("modules/imageResize", ImageResize);

const QuillWrapper = forwardRef((props, ref) => (
  <div className="quill-wrapper">
    <ReactQuill {...props} ref={ref} />
  </div>
));

QuillWrapper.displayName = "QuillWrapper";

const ReactQuillEditor = ({ onChange, value }) => {
  const quillRef = useRef();

  useEffect(() => {
    if (quillRef.current) {
      // Lấy instance của Quill
      const quill = quillRef.current.getEditor();

      // Tạo module để xử lý keyboard bindings
      const keyboard = quill.keyboard;

      // Xử lý phím Delete
      keyboard.addBinding(
        {
          key: 46, // mã phím Delete
        },
        (range, context) => {
          if (range.length === 0) {
            const [leaf] = quill.getLeaf(range.index);
            if (leaf.domNode && leaf.domNode.tagName === "img") {
              quill.deleteText(range.index, 1);
              return false;
            }
          }
          return true;
        }
      );

      // Xử lý phím Backspace
      keyboard.addBinding(
        {
          key: 8, // mã phím Backspace
        },
        (range, context) => {
          if (range.length === 0 && range.index > 0) {
            const [leaf] = quill.getLeaf(range.index - 1);
            if (leaf.domNode && leaf.domNode.tagName === "img") {
              quill.deleteText(range.index - 1, 1);
              return false;
            }
          }
          return true;
        }
      );
    }
  }, []);

  // Handler cho upload ảnh
  // Định nghĩa handlers với useCallback
  //  const imageHandler = useCallback(() => {
  //   const input = document.createElement('input');
  //   input.setAttribute('type', 'file');
  //   input.setAttribute('accept', 'image/*');
  //   input.click();

  //   input.onchange = async () => {
  //     const file = input.files[0];
  //     if (file) {
  //       try {
  //         // Tạo FormData để upload
  //         const formData = new FormData();
  //         formData.append("file", file);
  //         formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  //         const response = await axios.post(CLOUDINARY_URL, formData, {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         });

  //         // Giả lập API upload (thay thế bằng API thật của bạn)

  //         // Upload và lấy URL
  //         const imageUrl = response.data.secure_url;

  //         // Lấy instance của editor
  //         const editor = quillRef.current.getEditor();

  //         // Lấy vị trí con trỏ hiện tại
  //         const range = editor.getSelection(true);

  //         // Chèn hình ảnh vào editor
  //         editor.insertEmbed(range.index, "image", imageUrl);
  //       } catch (error) {
  //         console.error("Error uploading image: ", error);
  //       }
  //     }
  //   };
  // }, []);
  // Convert File to Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Convert Base64 to File
  const base64ToFile = (base64, filename) => {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          // Convert to base64
          const base64 = await fileToBase64(file);

          const editor = quillRef.current?.getEditor();
          if (editor) {
            const range = editor.getSelection(true);
            editor.insertEmbed(range.index, "image", base64);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };
  }, []);

  const modules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ header: "1" }, { header: "2" }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ["clean"],
        ["link", "image", "video"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
    imageResize: {
      parchment: ReactQuill.Quill.import("parchment"),
      modules: ["Resize", "DisplaySize", "Toolbar"],
      displayStyles: {
        backgroundColor: "black",
        border: "none",
        color: "white",
      },
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <QuillWrapper
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        formats={quillFormats}
        modules={modules}
        className="h-96 mb-12"
      />

      {/* <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Preview:</h3>
        <div 
          className="border p-4 rounded"
          
        />
          {parse(value)}
      </div> */}
    </div>
  );
};

export default ReactQuillEditor;
