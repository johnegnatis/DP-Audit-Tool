import { Button } from "antd";
import React from "react";
import Photo from "../../../assets/images/group-photo.jpg";

const text_boxes = [
  {id: 1, ttl: "Generate documents in a flash", text: "Upload a student transcript, edit details, then generate the degree plan and/or the audit report. No need to go through a separate process for each document.\n\nNote that we will not hold any student information in the application due to FERPA laws. You may save the documents locally."},
  {id: 2, ttl: "Regenerate new versions using previously generated documents", text: "Upload transcripts to start from scratch, or re-upload previously generated degree plans to create newer versions of the documents.\n\nAll necessary student information gets stored in the degree plan PDFs when they are generated with this application."},
  {id: 3, ttl: "Create documents in bulk", text: "Upload multiple student information in the start page, and switch between students through the tabs in the top bar. Close tabs when completed.\n\nManage multiple students with speed and efficiency. Don't worry about losing progress; system will ask for approval before closing tabs."},
  {id: 4, ttl: "Personalize degree plans", text: "All values are flexible and open to revisions in an intuitive manner.\n\nEdit course details, from names to grades, with a few clicks. Move and rearrange courses listed in the degree plan to better fit needs. Leave individual notes for students in the audit report."},
  {id: 5, ttl: "Easy database editing", text: "Edit course details from the sidebar to make direct changes to the database. No need to access the application code to add, remove, or edit courses.\n\nHowever, in case of significant changes, the database for tracks and courses is made of simply structured, easy-to-access JSON files."},
  {id: 6, ttl: "Easy proofreading", text: "Before saving documents, proofread the degree plan with our preview documents page. Simply move to and from the student edit page to check for errors.\n\nWhen you are sure that your draft is free from error, the last step is to enter your signature. Document is now ready!"}
]

const names = [
  {id: 1, name: "Zia Kim", position: "Project Lead / Designer", linkedin: "https://www.linkedin.com/in/nakxlak/"},
  {id: 2, name: "John Egnatis", position: "Technical Lead / Front End Developer", linkedin: "https://www.linkedin.com/in/john-egnatis/"},
  {id: 3, name: "Sai Gonuguntla", position: "Back End Developer", linkedin:"https://www.linkedin.com/in/sai-gonuguntla-790854215/"},
  {id: 4, name: "Haniyyah Hamid", position: "Back End Developer", linkedin:"https://www.linkedin.com/in/haniyyah-hamid-993169220/"},
  {id: 5, name: "Areeba Nandwani", position: "Back End Developer", linkedin:"https://www.linkedin.com/in/areeba-nandwani-055663194/"},
  {id: 6, name: "Jered Hightower", position: "Back End Developer", linkedin: null},
]

const SupportPage = ({ onClose }) => {
  return (
    <>
    
    <div className="support-page-root">
        <div className="support-page">
        <div className="section section-1">
          <div className="title">UTD CS/SE Graduate Advising Degree Plan and Audit Tool</div>
        </div>
        <div className="section section-2">
          <div className="left-column">
            <img src={Photo} alt="Developing team group photo" classname = "group-image" />
          </div>
          <div className="right-column">
            <p className="position"><strong>Project Lead / Designer</strong></p>
            <p>{names[0].name}</p>
            <p className="position"><strong>Technical Lead / Front End Developer</strong></p>
            <p>{names[1].name}</p>
            <p className="position"><strong>Back End Developer</strong></p>
            {names.slice(2).map(name =>(
              <div>
              <span>{name.name}</span>
            </div>
            ))}
          </div>
        </div>
        <div className="section section-3">
          {text_boxes.map(text_box => (
            <div className="box" key={text_box.id}>
              <p className="header">{text_box.ttl}</p>
              <br></br>
              <p>{text_box.text.split('\n').map((line, index) => (
                <span key={index}>{line}<br/></span>
              ))}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <footer>
      <div className="main">
        <span onClick={() => onClose()}>&lt; Back to Home Page</span>
      </div>
    </footer>
    </>
  );
};
export default SupportPage;