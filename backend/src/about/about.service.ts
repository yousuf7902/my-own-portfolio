import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Error as MongooseError, Model } from 'mongoose';
import { About } from './about.schema';
import { UpdateAboutDto } from './about.dto';

const DEFAULT_ABOUT = {
  greeting: 'Hi,',
  greetingSuffix: 'Myself',
  firstName: 'Yousuf',
  lastName: 'Hassan',
  roles: ['Competitive Programmer', 'Software Engineer', 'Programming Enthusiast', 'Ready to explore new things'],
  heroBio: 'I have a strong background in problem-solving through programming, data-structure and algorithms, competitive programming, and have experience in mentoring at University Programming Wing where I guide beginners in solving programming problems.',
  aboutText: 'I am currently pursuing a Bachelor of Science degree in Computer Science and Engineering at the International University of Business Agriculture and Technology(IUBAT).',
  email: 'yousufhassan04@gmail.com',
  resumeLink: 'https://drive.google.com/file/d/14l0fF6ctxpnQiwiYRSCDmKpo1uaSoYPx/view?usp=sharing',
  profileImage: '/images/myself.jpg',
  socials: {
    facebook: 'https://www.facebook.com/yousuf.hassan.7902/',
    linkedin: 'https://www.linkedin.com/in/yousuf-hassan-7902',
    github: 'https://github.com/yousuf7902/',
    email: 'yousufhassan04@gmail.com',
  },
};

@Injectable()
export class AboutService {
  constructor(
    @InjectModel(About.name)
    private readonly aboutModel: Model<About>,
  ) {}

  async get() {
    const about = await this.aboutModel.findOne();
    if (!about) return DEFAULT_ABOUT;
    return about;
  }

  async update(dto: UpdateAboutDto) {
    try {
      let about = await this.aboutModel.findOne();

      if (about) {
        Object.assign(about, dto);
        await about.save();
      } else {
        about = await this.aboutModel.create({ ...DEFAULT_ABOUT, ...dto });
      }

      return about;
    } catch (err) {
      if (err instanceof MongooseError.ValidationError) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }
}
