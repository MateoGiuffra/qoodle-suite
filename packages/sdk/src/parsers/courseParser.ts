import * as cheerio from 'cheerio';

export interface Activity {
    type: string;
    name: string;
    url: string | null;
}

export interface Section {
    name: string;
    summary: string;
    activities: Activity[];
}

export interface CourseContent {
    title: string;
    sections: Section[];
}

export function parseCourse(html: string): CourseContent {
    const $ = cheerio.load(html);

    const title = $('title').text().replace(/^Curso:\s*/, '').trim();

    const sections: Section[] = [];

    $('li[id^="section-"]').each((_, el) => {
        const $section = $(el);
        const name = $section.find('.sectionname').first().text().trim()
            || $section.attr('aria-label')
            || '';

        const summary = $section.find('.summary, .content > .no-overflow').first().text().trim();

        const activities: Activity[] = [];
        $section.find('li.activity').each((__, actEl) => {
            const $act = $(actEl);
            const classAttr = $act.attr('class') || '';
            const typeMatch = classAttr.match(/modtype_(\S+)/);
            const type = typeMatch ? typeMatch[1] : 'unknown';
            const activityName = $act.find('.instancename').first().text().trim();
            const url = $act.find('a.aalink, a[href*="/mod/"]').first().attr('href') || null;

            if (activityName) {
                activities.push({ type, name: activityName, url });
            }
        });

        if (name || activities.length > 0) {
            sections.push({ name, summary, activities });
        }
    });

    return { title, sections };
}
