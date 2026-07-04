import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { About, AboutDocument } from './schemas/about.schema';

export interface AboutUpdate {
  content?: string;
  contentEn?: string;
}

const DEFAULT_CONTENT_PT = `**Estudante | Entusiasta de Redes e Segurança**

Olá, sou Lucas Panzera. Sou um estudante apaixonado por explorar como a internet funciona por baixo dos panos.

Tenho um grande interesse nas áreas de redes de computadores, cibersegurança e administração de sistemas.

Sempre em busca de aprender coisas novas, montar laboratórios e entender a fundo a tecnologia que nos conecta.

## Habilidades

- Linux
- Networking
- Cybersecurity
- Python
- Bash
- Docker
- System Administration
- AWS
- Proxmox
- Firewalls`;

const DEFAULT_CONTENT_EN = `**Student | Networking & Security Enthusiast**

Hi, I'm Lucas Panzera. I'm a student passionate about exploring how the internet works under the hood.

I have a strong interest in computer networking, cybersecurity, and systems administration.

Always looking to learn new things, build home labs, and deeply understand the technology that connects us.

## Skills

- Linux
- Networking
- Cybersecurity
- Python
- Bash
- Docker
- System Administration
- AWS
- Proxmox
- Firewalls`;

@Injectable()
export class AboutService {
  constructor(
    @InjectModel(About.name)
    private readonly aboutModel: Model<AboutDocument>,
  ) {}

  async get(): Promise<AboutDocument> {
    const existing = await this.aboutModel.findOne().exec();
    if (existing) return existing;
    return this.aboutModel.create({
      content: DEFAULT_CONTENT_PT,
      contentEn: DEFAULT_CONTENT_EN,
    });
  }

  async update(updates: AboutUpdate): Promise<AboutDocument> {
    const about = await this.get();
    if (updates.content !== undefined) about.content = updates.content;
    if (updates.contentEn !== undefined)
      about.contentEn = updates.contentEn || undefined;
    return about.save();
  }
}
