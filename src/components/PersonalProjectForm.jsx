import React, { useEffect, useState } from "react";
import { Button, Form, Input, Tabs, Upload, message } from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useRecoilState } from "recoil";

import { getData, updateData } from "../firebaseFunctions.js";
import { database } from "../firebaseConfig.js";
import axios from "axios";
import {
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_URL,
} from "../cloudDinaryConfig.js";
import { personalProjectsState } from "../recoil/atom.jsx";

const { TextArea } = Input;
const { TabPane } = Tabs;

const ProjectForm = ({ projectKey, form, language, onDelete }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    form.getFieldValue([
      "personalProjects",
      "listProject",
      projectKey,
      "image",
    ]) || ""
  );

  const beforeUpload = (file) => {
    setFile(file);
    return false;
  };

  const handleUpload = async () => {
    if (!file) {
      message.error("Please select an image to upload!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const imageUrl = response.data.secure_url;
      setImageUrl(imageUrl);
      form.setFieldsValue({
        ...form.getFieldsValue(),
        personalProjects: {
          ...form.getFieldValue("personalProjects"),
          listProject: {
            ...form.getFieldValue(["personalProjects", "listProject"]),
            [projectKey]: {
              ...form.getFieldValue([
                "personalProjects",
                "listProject",
                projectKey,
              ]),
              image: imageUrl,
            },
          },
        },
      });
      setFile(null);
      message.success("Upload successful!");
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form.Item
        label="Project Name"
        name={[
          "personalProjects",
          "listProject",
          projectKey,
          "content",
          language,
          "projectName",
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Project Description"
        name={[
          "personalProjects",
          "listProject",
          projectKey,
          "content",
          language,
          "projectDescription",
        ]}
      >
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item
        label="Project Link"
        name={[
          "personalProjects",
          "listProject",
          projectKey,
          "content",
          language,
          "projectLink",
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Project Image URL"
        name={["personalProjects", "listProject", projectKey, "image"]}
      >
        <Input disabled value={imageUrl} />
      </Form.Item>
      <Form.Item label="Upload Image">
        <Upload
          beforeUpload={beforeUpload}
          showUploadList={false}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />}>Select Image</Button>
        </Upload>
        <Button
          type="primary"
          onClick={handleUpload}
          loading={loading}
          style={{ marginTop: 16 }}
        >
          Upload
        </Button>
      </Form.Item>
      {imageUrl && (
        <Form.Item label="Image Preview">
          <img
            src={imageUrl}
            alt="Image Preview"
            style={{ width: "200px", marginTop: "16px" }}
          />
        </Form.Item>
      )}
    </>
  );
};
const PersonalProjectsForm = ({ form, language }) => {
  const [personalProjects, setPersonalProjects] = useRecoilState(
    personalProjectsState
  );
  const [projectKeys, setProjectKeys] = useState([]);

  useEffect(() => {
    const fetchPersonalProjectsData = async () => {
      const data = await getData(database, "personalProjects");
      if (data) {
        setPersonalProjects(data);
        form.setFieldsValue({
          ...form.getFieldsValue(),
          personalProjects: data,
        });
        setProjectKeys(Object.keys(data.listProject || {}));
      }
    };

    fetchPersonalProjectsData();
  }, [setPersonalProjects, form]);

  const addProject = () => {
    const existingKeys = new Set(projectKeys);
    let newKey;
    let i = 1;

    // Tìm key mới không trùng lặp với các key hiện có
    do {
      newKey = `project${i}`;
      i++;
    } while (existingKeys.has(newKey));

    const updatedProjectKeys = [...projectKeys, newKey];
    setProjectKeys(updatedProjectKeys);

    const updatedPersonalProjects = {
      ...personalProjects,
      listProject: {
        ...personalProjects.listProject,
        [newKey]: {
          content: {
            "en-US": {
              projectName: "",
              projectDescription: "",
              projectLink: "",
            },
            "vi-VN": {
              projectName: "",
              projectDescription: "",
              projectLink: "",
            },
          },
          image: "",
        },
      },
    };
    setPersonalProjects(updatedPersonalProjects);
    form.setFieldsValue({
      ...form.getFieldsValue(),
      personalProjects: updatedPersonalProjects,
    });
  };

  const deleteProject = (projectKey) => {
    const updatedProjectKeys = projectKeys.filter((key) => key !== projectKey);
    setProjectKeys(updatedProjectKeys);

    const updatedPersonalProjects = {
      ...personalProjects,
      listProject: { ...personalProjects.listProject },
    };
    delete updatedPersonalProjects.listProject[projectKey];
    setPersonalProjects(updatedPersonalProjects);

    form.setFieldsValue({
      ...form.getFieldsValue(),
      personalProjects: updatedPersonalProjects,
    });

    // Cập nhật Firebase
    updateData(database, "personalProjects", updatedPersonalProjects)
      .then(() => {
        message.success("Project deleted successfully");
      })
      .catch((error) => {
        message.error("Error deleting project: " + error.message);
      });
  };

  return (
    <div>
      <Tabs defaultActiveKey="1">
        {projectKeys.map((projectKey) => (
          <TabPane
            tab={
              <span>
                Project {projectKey.replace("project", "")}
                <Button
                  type="danger"
                  icon={<DeleteOutlined />}
                  onClick={() => deleteProject(projectKey)}
                  style={{ marginLeft: 8 }}
                />
              </span>
            }
            key={projectKey}
          >
            <ProjectForm
              projectKey={projectKey}
              form={form}
              language={language}
            />
          </TabPane>
        ))}
        <TabPane
          tab={
            <span>
              <Button icon={<PlusOutlined />} onClick={addProject} />
            </span>
          }
          key="add"
        />
      </Tabs>
    </div>
  );
};
export default PersonalProjectsForm;
