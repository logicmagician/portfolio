"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowDown, ArrowUpRight, Github, Linkedin, Mail,
  Cpu, CircuitBoard, Code2, BrainCircuit, Zap, Download, Terminal, Layers3,
} from "lucide-react";
import { profile } from "@/data/profile";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";
import { journey } from "@/data/journey";
import { primaryNav } from "@/data/navigation";
import { getFeaturedProjects } from "@/lib/projects";
import { withBasePath } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { LinkOrPending } from "@/components/ui/LinkOrPending";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { BootScreen } from "@/components/layout/BootScreen";

const EngineeringScene = dynamic(() => import("@/components/EngineeringScene"), {
  ssr: false,
  loading: () => <div className="scene-placeholder"><div className="loader-ring" /><span>INITIALIZING 3D ENVIRONMENT</span></div>,
});

const skillIcons = [Code2, Cpu, CircuitBoard, Layers3, BrainCircuit, Zap];
const featuredProjects = getFeaturedProjects(projects);
const journeyPreview = journey.filter((entry) => entry.featured);

export default function Portfolio() {
  return (
    <>
      <BootScreen />

      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <SiteHeader items={primaryNav} />

      <main id="main" tabIndex={-1}>
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="status-pulse" /> {profile.availability}</div>
            <p className="hero-kicker">COMPUTER ENGINEERING STUDENT <span> / </span> TECHNOLOGY ENTHUSIAST</p>
            <h1>Engineering ideas.<br /><span>Building what&apos;s next.</span></h1>
            <p className="hero-description">{profile.intro}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">Explore my work <ArrowUpRight size={17} /></a>
              {profile.hasResume ? (
                <a className="button button-ghost" href={withBasePath(`/${profile.resumeFile}`)} download><Download size={16} /> Download CV</a>
              ) : (
                <span className="button button-ghost button-disabled" aria-disabled="true"><Download size={16} /> CV upload pending</span>
              )}
            </div>
            <div className="hero-footnote"><span className="line" /> BASED IN {profile.location.toUpperCase()}</div>
          </div>
          <div className="hero-visual">
            <EngineeringScene />
            <div className="floating-label label-top"><span>01</span> SEMICONDUCTOR CORE</div>
            <div className="floating-label label-bottom"><span>02</span> SIGNAL PROCESSING</div>
          </div>
          <a className="scroll-cue" href="#about"><span>SCROLL TO EXPLORE</span><ArrowDown size={15} /></a>
          <div className="hero-index">PORTFOLIO / 2026</div>
        </section>

        <section className="intro-strip" aria-label="Focus areas">
          <div className="strip-inner">
            <span>HARDWARE</span><i /> <span>SOFTWARE</span><i /> <span>INTELLIGENT SYSTEMS</span><i /> <span>INNOVATION</span>
          </div>
        </section>

        <section className="content-section section-wrap" id="about">
          <Reveal>
            <div className="section-heading">
              <p className="section-index">01 / THE ENGINEER</p>
              <h2>Curiosity drives.<br /><span>Engineering delivers.</span></h2>
            </div>
          </Reveal>
          <div className="about-grid">
            <Reveal>
              <div className="about-lead">
                <span className="micro-label">A LITTLE ABOUT ME</span>
                <p>I&apos;m <strong>{profile.name}</strong>, a third-year computer engineering student interested in building systems where electronics, computation and software meet.</p>
                <p>My work moves between hands-on hardware, such as power conversion and embedded telemetry, and software projects, such as offline-first web apps and quiz platforms.</p>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="credential-card">
                <div className="credential-icon"><Cpu size={24} /></div>
                <span className="micro-label">ACADEMIC BACKGROUND</span>
                <h3>{profile.degree}</h3>
                <p>{profile.university}</p>
                <p>Stage: {profile.academicStage}</p>
                <p>Expected graduation: {profile.expectedGraduation}</p>
                <div className="credential-line" />
                <span className="credential-foot">COMPUTING · ELECTRONICS · SYSTEMS</span>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="content-section section-wrap" id="expertise">
          <Reveal>
            <div className="section-heading heading-row">
              <div>
                <p className="section-index">02 / TECHNICAL EXPERTISE</p>
                <h2>Tools for turning<br /><span>complexity into clarity.</span></h2>
              </div>
              <Link className="text-link" href="/skills/">All skills <ArrowUpRight size={16} /></Link>
            </div>
          </Reveal>
          <div className="skills-grid">
            {skills.map((group, i) => {
              const Icon = skillIcons[i % skillIcons.length];
              return (
                <Reveal key={group.title} delay={i * 0.045}>
                  <article className="skill-card">
                    <div className="skill-card-top"><span className="skill-icon"><Icon size={20} /></span><span className="card-number">0{i + 1}</span></div>
                    <h3>{group.title}</h3>
                    <div className="skill-tags">{group.items.map((item) => <span key={item}>{item}</span>)}</div>
                    <div className="card-circuit" />
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="content-section projects-section section-wrap" id="projects">
          <Reveal>
            <div className="section-heading heading-row">
              <div><p className="section-index">03 / SELECTED WORK</p><h2>Built through<br /><span>experimentation.</span></h2></div>
              <Link className="text-link" href="/projects/">All projects <ArrowUpRight size={16} /></Link>
            </div>
          </Reveal>
          <div className="projects-grid">
            {featuredProjects.map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.07}>
                <ProjectCard project={project} index={i} />
              </Reveal>
            ))}
          </div>
        </section>

        <section className="research-band" id="research">
          <div className="research-inner section-wrap">
            <Reveal>
              <div className="research-visual">
                <div className="radar-ring ring-one" /><div className="radar-ring ring-two" /><div className="radar-ring ring-three" />
                <div className="radar-center"><BrainCircuit size={40} /></div>
                <span className="radar-label radar-label-one">DATA</span><span className="radar-label radar-label-two">MODEL</span><span className="radar-label radar-label-three">INSIGHT</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="research-copy">
                <p className="section-index">04 / RESEARCH & INNOVATION</p>
                <h2>Ask better questions.<br /><span>Build better systems.</span></h2>
                <p>Research publications and working papers will be listed here once they are available.</p>
                <Link className="text-link" href="/research/">View research <ArrowUpRight size={16} /></Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="content-section section-wrap" id="journey">
          <Reveal>
            <div className="section-heading heading-row">
              <div><p className="section-index">05 / THE JOURNEY</p><h2>Learning by making.<br /><span>Growing by questioning.</span></h2></div>
              <Link className="text-link" href="/journey/">Full journey <ArrowUpRight size={16} /></Link>
            </div>
          </Reveal>
          <div className="timeline">
            {journeyPreview.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.08}>
                <div className="timeline-item">
                  <span className="timeline-year">{item.period}</span>
                  <span className="timeline-node" />
                  <div><h3>{item.title}</h3><p>{item.organization ? `${item.organization}. ` : ""}{item.detail}</p></div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="content-section writing-section section-wrap" id="writing">
          <Reveal>
            <div className="writing-card">
              <div><p className="section-index">06 / BEYOND ENGINEERING</p><h2>Technology is a discipline.<br /><span>Ideas are a lifelong pursuit.</span></h2><p>Outside technical work, I enjoy writing, exploring business ideas and thinking about how technology can create meaningful value.</p><Link className="text-link" href="/blog/">Read the blog <ArrowUpRight size={16} /></Link></div>
              <div className="writing-symbol"><Terminal size={58} /><span>THINK / WRITE / CREATE</span></div>
            </div>
          </Reveal>
        </section>

        <section className="contact-section section-wrap" id="contact">
          <Reveal>
            <p className="section-index">07 / START A CONVERSATION</p>
            <h2>Have an idea?<br /><span>Let&apos;s engineer it.</span></h2>
            <p className="contact-subtitle">Open to meaningful conversations, technical collaborations and opportunities to learn and build.</p>
            <LinkOrPending className="button button-primary contact-button" href={`mailto:${profile.email}`} external={false}>
              Get in touch <Mail size={17} />
            </LinkOrPending>
            <div className="social-links">
              <LinkOrPending href={profile.github}><Github size={17} /> GitHub <ArrowUpRight size={13} /></LinkOrPending>
              <LinkOrPending href={profile.linkedin}><Linkedin size={17} /> LinkedIn <ArrowUpRight size={13} /></LinkOrPending>
              <LinkOrPending href={`mailto:${profile.email}`} external={false}><Mail size={17} /> Email <ArrowUpRight size={13} /></LinkOrPending>
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
