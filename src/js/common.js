import i18next from "i18next";

export const isMobile = function () {
  const match = window.matchMedia("(pointer:coarse)");
  return match && match.matches;
};

export const dataEng = {
  translation: {
    info: "Infomation",
    fullName: "Full Name",
    birthday: "Birthday",
    infoBirthday: "07/21/1998",
    Uni: "University",
    nameUni: "VNU university of science",
    major: "Major",
    nameMajor: "Mathematics and Informatics ",
    workExp: "Work Experience",
    amela: "Amela company",
    role: "Role",
    sotatek: "Sotatek company",
    skill: "Skills",
    uiLib: "UI libraries",
    basicSkill: "Basic skills",
    lib: "Js library",
    formLib: " Form libraries",
    apiLib: "API and data management libraries",
    projectTools: " Project management tools",
    english: "English",
    rateEl: "basic, communicate, read docs",
    projectProgress: "Project progress",
    personalProjects: "Personal projects",
    languageQues: "What the sort of language do you prefer?",
    thankful: "Thank you for watching my CV !",
    project: "Have experience about 3D + 2D website using threejs and js,ecommerce website and web3. ",
    projectName: "Project",
    notice: "After confirm what language you want, press space bar on keyboard to continue please!!!",
    noticeMobile: "After confirm what language you want, left-click to continue please!!!",
  },
};

export const dataVi = {
  translation: {
    info: "Thông tin",
    fullName: "Tên",
    birthday: "Sinh nhật",
    infoBirthday: "21/07/1998",
    Uni: "Đại học",
    nameUni: "trường đại học khoa học tự nhiên - đại học quốc gia Hà Nội",
    major: "Chuyên ngành",
    nameMajor: "Toán-tin",
    workExp: "Kinh nghiệm",
    amela: "Công ty Amela",
    role: "Vị trí",
    sotatek: "Công ty Sotatek",
    skill: "Skills",
    uiLib: "Thư viện UI",
    basicSkill: "Kĩ năng cơ bản",
    lib: "Thư viện Js",
    apiLib: "Thư viện quản lí data và API",
    projectTools: "Công cụ quản lý",
    english: "Tiếng anh",
    rateEl: "cơ bản, giao tiếp và đọc tài liệu",
    projectProgress: "Quy trình dự án",
    personalProjects: "Dự án cá nhân",
    formLib: " Thư viện form",
    languageQues: "Ngôn ngữ bạn chọn là gì?",
    thankful: "Cảm ơn các anh chị đã xem CV !",
    project: "Có kinh nghiệm làm các dự án 3D + 2D website sử dụng ngôn ngữ threejs và js, trang web thương mại điện tử và web3. ",
    projectName: "Dự án",
    notice: "Sau khi chọn ngôn ngữ, làm ơn ấn nút cách trên bàn phím để tiếp tục!!!",
    noticeMobile: "Sau khi chọn ngôn ngữ, làm ơn click chuột trái để tiếp tục!!!",
  },
};

export function changeLanguage(lng) {
  i18next.changeLanguage(lng);
}
