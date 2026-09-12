import dbConnect from "@/lib/mongodb";
import AboutModel from "@/models/About";
import SkillModel from "@/models/Skill";
import ProjectModel from "@/models/Project";
import AchievementModel from "@/models/Achievement";
import ExperienceModel from "@/models/Experience";

const DEFAULT_ABOUT = {
  greeting: "Hi,",
  greetingSuffix: "Myself",
  firstName: "Yousuf",
  lastName: "Hassan",
  roles: [
    "Competitive Programmer",
    "Software Engineer",
    "Programming Enthusiast",
    "Ready to explore new things",
  ],
  heroBio:
    "I have a strong background in problem-solving through programming, data-structure and algorithms, competitive programming, and have experience in mentoring at University Programming Wing where I guide beginners in solving programming problems.",
  aboutText:
    "I am currently pursuing a Bachelor of Science degree in Computer Science and Engineering at the International University of Business Agriculture and Technology(IUBAT).",
  email: "yousufhassan04@gmail.com",
  resumeLink:
    "https://drive.google.com/file/d/14l0fF6ctxpnQiwiYRSCDmKpo1uaSoYPx/view?usp=sharing",
  profileImage: "/images/myself.jpg",
  socials: {
    facebook: "https://www.facebook.com/yousuf.hassan.7902/",
    linkedin: "https://www.linkedin.com/in/yousuf-hassan-7902",
    github: "https://github.com/yousuf7902/",
    email: "yousufhassan04@gmail.com",
  },
};

export async function getAboutData() {
  try {
    await dbConnect();
    const about = await AboutModel.findOne().lean();
    if (about) return JSON.parse(JSON.stringify(about));
    return DEFAULT_ABOUT;
  } catch {
    return DEFAULT_ABOUT;
  }
}

export async function getSkillsData() {
  try {
    await dbConnect();
    const skills = await SkillModel.find().sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(skills));
  } catch {
    return [];
  }
}

export async function getProjectsData() {
  try {
    await dbConnect();
    const projects = await ProjectModel.find().sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(projects));
  } catch {
    return [];
  }
}

export async function getAchievementsData() {
  try {
    await dbConnect();
    const achievements = await AchievementModel.find().sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(achievements));
  } catch {
    return [];
  }
}

export async function getExperiencesData() {
  try {
    await dbConnect();
    const experiences = await ExperienceModel.find().sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(experiences));
  } catch {
    return [];
  }
}
