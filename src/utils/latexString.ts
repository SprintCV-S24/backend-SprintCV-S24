import { getLatexPreamble, getLatexContentSizedPreamble } from "./latexData";
import { ExperienceType } from "../models/experience.model";
import { HeadingType } from "../models/heading.model";
import { EducationType } from "../models/education.model";
import { ProjectType } from "../models/project.model";
import { SkillsType } from "../models/skills.model";
import { ActivitiesType } from "../models/activities.model";
import { SectionHeadingType } from "../models/sectionHeading.model";
import { BaseItem, resumeItemTypes } from "../models/itemTypes";

function sanitize(str: string): string {
  const symbolMap: { [key: string]: string } = {
    "'": "\\textquotesingle{}",
    '"': "\\textquotedbl{}",
    "`": "\\textasciigrave{}",
    "^": "\\textasciicircum{}",
    "~": "\\textasciitilde{}",
    "<": "\\textless{}",
    ">": "\\textgreater{}",
    "|": "\\textbar{}",
    "\\": "\\textbackslash{}",
    "{": "\\{",
    "}": "\\}",
    $: "\\$",
    "&": "\\&",
    "#": "\\#",
    _: "\\_",
    "%": "\\%",
    "/": "\\textbackslash{}",
    "[": "\\textlbrack{}",
    "]": "\\textrbrack{}",
  };

  return Array.from(str)
    .map((char) => symbolMap[char] || char)
    .join("");
}

/*  ------------------------------------------------- */
/*  -------------------Heading----------------------- */
/*  ------------------------------------------------- */

/**
 * Generates the LaTeX header for the resume, including personal details and contact information. This
 * function creates a LaTeX block that represents the header section of the resume, formatted according
 * to the specified LaTeX commands and styles.
 *
 * @param {HeadingType} activityObj - An object containing the necessary data to populate the header section.
 * @returns {string} The generated LaTeX code for the resume header.
 */
export const generateHeaderLatex = (activityObj: HeadingType): string => {
  let headerLatex = getLatexContentSizedPreamble();
  headerLatex = headerLatex.replace(
    "\\usepackage[top=0in, left=1in, right=1in, bottom=1in]{geometry}",
    "\\usepackage[top=.3in, left=1in, right=1in, bottom=1in]{geometry}",
  );
	headerLatex = headerLatex.replace(
		"\\pdfpageheight=\\dimexpr\\ht0+\\dimen0",
		"\\pdfpageheight=\\dimexpr\\ht0+\\dimen0+.3in"
	);
  headerLatex += `\\begin{document}\n`;

  headerLatex += generateHeaderLatexHelper(activityObj as HeadingType);

  headerLatex += `\\vspace{-\\lastskip}\\end{document}`;

  return headerLatex;
};

export const generateHeaderLatexHelper = (
  activityObj: HeadingType,
): string => {
  let headerLatex = `\\begin{center}\n`;
  headerLatex += `\\textbf{\\Huge ${sanitize(
    activityObj.name,
  )}} \\\\ \\vspace{1pt}\n`;
  headerLatex += `\\small `;

  // Iterate over each item to append it to the LaTeX string
  activityObj.items.forEach((item, index) => {
    const sanitizedItem = sanitize(item.item);
    if (item.href) {
      headerLatex += `\\href{${item.href}}{\\underline{${sanitizedItem}}}`;
    } else {
      headerLatex += sanitizedItem;
    }

    // Add a separator if it's not the last item
    if (index < activityObj.items.length - 1) {
      headerLatex += ` $|$ `;
    }
  });
  headerLatex += `\n\\end{center}`;

  return headerLatex;
};

/*  ------------------------------------------------- */
/*  -------------------Education--------------------- */
/*  ------------------------------------------------- */

/**
 * Generates the LaTeX code for the education section of the resume. This function constructs a LaTeX
 * block that lists educational qualifications, including institution names, degrees, and dates.
 *
 * @param {EducationType} educationObj - An object containing data for the education section.
 * @returns {string} The generated LaTeX code for the education section of the resume.
 */
export const generateEducationLatex = (educationObj: EducationType): string => {
  let latexString = getLatexContentSizedPreamble();
  latexString += `\\begin{document}\n\\resumeSubHeadingListStart\n`;

  latexString += generateEducationLatexHelper(educationObj as EducationType);

  latexString += `\\resumeSubHeadingListEnd\n\\vspace{-\\lastskip}\n\\end{document}\n`;

  return latexString;
};

export const generateEducationLatexHelper = (
  educationObj: EducationType,
): string => {
  let latexString = ``;

  // Assuming educationObj is a single object and not an array here
  latexString += `\\resumeSubheading
      {${sanitize(educationObj.title)}}{${sanitize(educationObj.location)}}
      {${sanitize(educationObj.subtitle)}}{${sanitize(educationObj.year)}}
    `;

  if (educationObj.bullets.length > 0) {
    latexString += `\\resumeItemListStart\n`;
    educationObj.bullets.forEach((bullet) => {
      latexString += `\\resumeItem{${sanitize(bullet)}}\n`;
    });
    latexString += `\\resumeItemListEnd\n`;
  }

  return latexString;
};

/*  ------------------------------------------------- */
/*  -------------------Experience-------------------- */
/*  ------------------------------------------------- */

/**
 * Generates the LaTeX code for the experience section of the resume. This function creates a LaTeX
 * block that details professional experience, including job titles, company names, dates, and descriptions.
 *
 * @param {ExperienceType} activityObj - An object containing data for the experience section.
 * @returns {string} The generated LaTeX code for the experience section of the resume.
 */
export const generateExperienceLatex = (activityObj: ExperienceType) => {
  let latexString = getLatexContentSizedPreamble();
  latexString += `\\begin{document}\n\\resumeSubHeadingListStart`;

  latexString += generateExperienceLatexHelper(activityObj as ExperienceType);

  latexString +=
    "\\resumeSubHeadingListEnd\n\\vspace{-\\lastskip}\n\\end{document}\n";

  return latexString;
};

export const generateExperienceLatexHelper = (activityObj: ExperienceType) => {
  let latexString = `\n\\resumeSubheading{${sanitize(
    activityObj.subtitle,
  )}}{${sanitize(activityObj.year)}}{${sanitize(activityObj.title)}}{${sanitize(
    activityObj.location,
  )}}
    `;

  if (activityObj.bullets.length > 0) {
    latexString += `\\resumeItemListStart\n`;
    activityObj.bullets.forEach((bulletPoint) => {
      latexString += `\\resumeItem{${sanitize(bulletPoint)}}`;
    });
    latexString += "\\resumeItemListEnd\n";
  }

  return latexString;
};

/*  ------------------------------------------------- */
/*  -------------------Projects---------------------- */
/*  ------------------------------------------------- */

/**
 * Generates the LaTeX code for the projects section of the resume. This function constructs a LaTeX
 * block that showcases personal or academic projects, including titles, technologies used, and descriptions.
 *
 * @param {ProjectType} projectObj - An object containing data for the projects section.
 * @returns {string} The generated LaTeX code for the projects section of the resume.
 */
export const generateProjectLatex = (projectObj: ProjectType): string => {
  let latexString = getLatexContentSizedPreamble();
  latexString += "\\begin{document}\n\\resumeSubHeadingListStart\n";

  latexString += generateProjectLatexHelper(projectObj as ProjectType);

  latexString +=
    "\\resumeSubHeadingListEnd\n\\vspace{-\\lastskip}\n\\end{document}\n";

  return latexString;
};

export const generateProjectLatexHelper = (
  projectObj: ProjectType,
): string => {
  let latexString = "";

  // Check if technologies are provided and append them to the title
  const titleWithTechnologies = projectObj.technologies
    ? `\\textbf{${sanitize(projectObj.title)}} $|$ \\emph{${sanitize(
        projectObj.technologies,
      )}}`
    : `\\textbf{${sanitize(projectObj.title)}}`;

  latexString += `\\resumeProjectHeading\n`;
  latexString += `{${titleWithTechnologies}}{${sanitize(projectObj.year)}}\n`;

  if (projectObj.bullets.length > 0) {
    latexString += `\\resumeItemListStart\n`;
    projectObj.bullets.forEach((bullet) => {
      latexString += `\\resumeItem{${sanitize(bullet)}}\n`;
    });

    latexString += "\\resumeItemListEnd\n";
  }

  return latexString;
};

/*  ------------------------------------------------- */
/*  -------------------SKILLS==---------------------- */
/*  ------------------------------------------------- */

/**
 * Generates the LaTeX code for the skills section of the resume. This function creates a concise LaTeX
 * list of skills, typically highlighting technical abilities and other competencies.
 *
 * @param {SkillsType} skillsObj - An object containing data for the skills section.
 * @returns {string} The generated LaTeX code for the skills section of the resume.
 */
export const generateSkillsLatex = (skillsObj: SkillsType): string => {
  let latexString = getLatexContentSizedPreamble();
  latexString += "\\begin{document}\n";

  latexString += generateSkillsLatexHelper(skillsObj as SkillsType);

  latexString += "\\vspace{-\\lastskip}\n\\end{document}\n";

  return latexString;
};

export const generateSkillsLatexHelper = (skillsObj: SkillsType): string => {
  let latexString = "\n\\begin{itemize}[leftmargin=0.15in, label={}]\n";
  latexString += "\\small{\\item{";
  latexString += `\\textbf{${sanitize(skillsObj.title)}}{: ${sanitize(
    skillsObj.description,
  )}} \\\\`;
  latexString += "}}\n\\end{itemize}\n";

  return latexString;
};

/*  ------------------------------------------------- */
/*  -------------------Activity---------------------- */
/*  ------------------------------------------------- */

/**
 * Generates the LaTeX code for the activities section of the resume. This function constructs a LaTeX
 * block that details extracurricular activities, volunteer work, or other non-professional experiences.
 *
 * @param {ActivitiesType} activityObj - An object containing data for the activities section.
 * @returns {string} The generated LaTeX code for the activities section of the resume.
 */
export const generateActivityLatex = (activityObj: ActivitiesType) => {
  let latexString = getLatexContentSizedPreamble();
  latexString += `\\begin{document}\n\\resumeSubHeadingListStart\n`;

  latexString += generateActivityLatexHelper(activityObj as ActivitiesType);

  latexString +=
    "\\resumeSubHeadingListEnd\n\\vspace{-\\lastskip}\n\\end{document}\n";

  return latexString;
};

export const generateActivityLatexHelper = (activityObj: ActivitiesType) => {
	console.log("activityObj:", activityObj)
  let latexString = `\\resumeSubheading{${sanitize(
    activityObj.title,
  )}}{${sanitize(activityObj.year)}}{${sanitize(
    activityObj.subtitle,
  )}}{${sanitize(activityObj.location)}}`;

  if (activityObj.bullets.length > 0) {
    latexString += `\\resumeItemListStart\n`;
    activityObj.bullets.forEach((bulletPoint) => {
      latexString += `\\resumeItem{${sanitize(bulletPoint)}}`;
    });
    latexString += `\\resumeItemListEnd\n`;
  }

  latexString += "";

  return latexString;
};

/*  ------------------------------------------------- */
/*  -------------------Header---------------------- */
/*  ------------------------------------------------- */

/**
 * Generates a LaTeX header for a specific section of the resume. This function creates a section
 * heading in the LaTeX document, which is used to introduce the subsequent content block, such as
 * experience, education, or projects.
 *
 * @param {SectionHeadingType} activityObj - An object containing the title for the section header.
 * @returns {string} The generated LaTeX code for the section header.
 */
export const generateSectionHeadingLatex = (
  activityObj: SectionHeadingType,
) => {
  let latexString = getLatexContentSizedPreamble();
	latexString = latexString.replace(
    "\\usepackage[top=0in, left=1in, right=1in, bottom=1in]{geometry}",
    "\\usepackage[top=.05in, left=1in, right=1in, bottom=1in]{geometry}",
  );
	latexString = latexString.replace(
		"\\pdfpageheight=\\dimexpr\\ht0+\\dimen0",
		"\\pdfpageheight=\\dimexpr\\ht0+\\dimen0+.05in"
	);

  latexString += `\\begin{document}`;

  latexString += generateSectionHeadingLatexHelper(
    activityObj as SectionHeadingType,
  );

  latexString += "\n\\vspace{-\\lastskip}\n\\end{document}\n";

  console.log("SUBHEADINGXX:", latexString);
  return latexString;
};

export const generateSectionHeadingLatexHelper = (
  activityObj: SectionHeadingType,
) => {
  let latexString = `\n\\section{${sanitize(activityObj.title)}}\n`;
  return latexString;
};

export const generateLatex = (object: BaseItem): string => {
  switch (object.type) {
    case resumeItemTypes.EDUCATION:
      return generateEducationLatex(object as EducationType);

    case resumeItemTypes.EXPERIENCE:
      return generateExperienceLatex(object as ExperienceType);

    case resumeItemTypes.ACTIVITY:
      return generateActivityLatex(object as ActivitiesType);

    case resumeItemTypes.HEADING:
      return generateHeaderLatex(object as HeadingType);

    case resumeItemTypes.PROJECT:
      return generateProjectLatex(object as ProjectType);

    case resumeItemTypes.SECTIONHEADING:
      return generateSectionHeadingLatex(object as SectionHeadingType);

    case resumeItemTypes.SKILL:
      return generateSkillsLatex(object as SkillsType);
  }
};

const itemsInSubHeadingList = [
  resumeItemTypes.ACTIVITY,
  resumeItemTypes.EDUCATION,
  resumeItemTypes.EXPERIENCE,
  resumeItemTypes.PROJECT,
];

export const generateFullResume = (resumeItems: BaseItem[]): string => {
  let latexString = getLatexPreamble();
  latexString += "\\begin{document}\n";
  let isInSubHeadingList = false;

  const startList = () => {
    if (!isInSubHeadingList) {
      latexString += `\\resumeSubHeadingListStart\n`;
      isInSubHeadingList = true;
    }
  };

  const endList = (nextItem: BaseItem | undefined) => {
    if (nextItem == null || !itemsInSubHeadingList.includes(nextItem.type)) {
      latexString += `\\resumeSubHeadingListEnd\n`;
      isInSubHeadingList = false;
    }
  };

  for (let i = 0; i < resumeItems.length; ++i) {
    const item = resumeItems[i] as BaseItem;

    switch (item.type) {
      case resumeItemTypes.HEADING:
        latexString += generateHeaderLatexHelper(item as HeadingType);
        break;
      case resumeItemTypes.SECTIONHEADING:
        latexString += `\\section{${sanitize((item as SectionHeadingType).title)}}\n`;
        break;
      case resumeItemTypes.EDUCATION:
        startList();
        latexString += generateEducationLatexHelper(item as EducationType);
        endList(resumeItems[i + 1]);
        break;
      case resumeItemTypes.EXPERIENCE:
        startList();
        latexString += generateExperienceLatexHelper(item as ExperienceType);
        endList(resumeItems[i + 1]);
        break;
      case resumeItemTypes.ACTIVITY:
        startList();
        latexString += generateActivityLatexHelper(item as ActivitiesType);
        endList(resumeItems[i + 1]);
        break;
      case resumeItemTypes.PROJECT:
        startList();
        latexString += generateProjectLatexHelper(item as ProjectType);
        endList(resumeItems[i + 1]);
        break;
      case resumeItemTypes.SKILL:
        latexString += generateSkillsLatexHelper(item as SkillsType);
        break;
    }
  }

  latexString += "\\end{document}\n";
  return latexString;
};