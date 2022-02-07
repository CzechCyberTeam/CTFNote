import { ICalCalendar } from "ical-generator";
import { Request, Response, Handler } from "express";
import { Pool } from "pg";
import slugify from "slugify";

type CtfRow = {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  ctf_url: string;
  description: string;
};

type IcalPasswordRow = {
  ical_password: string;
};

export function icalRoute(pool: Pool): Handler {
  async function checkIcalPassword(
    userPass: string | undefined
  ): Promise<boolean> {
    const r = await pool.query<IcalPasswordRow>(
      "SELECT ical_password FROM ctfnote.settings"
    );
    const db_password = r.rows[0].ical_password;
    // If the password is null or empty allow any user
    if (!db_password) return true;
    return db_password === userPass;
  }

  async function getCtfs(): Promise<CtfRow[]> {
    const r = await pool.query<CtfRow>(
      "SELECT id, title, start_time, end_time, ctf_url, description FROM ctfnote.ctf"
    );

    return r.rows;
  }

  return async function (req: Request, res: Response): Promise<void> {
    const { key } = req.query;

    if (
      !(typeof key == "string" || key == undefined) ||
      !(await checkIcalPassword(key))
    ) {
      res.status(403);
      res.send("Forbidden\n");
      return;
    }

    const cal = new ICalCalendar();
    const ctfs = await getCtfs();

    for (const ctf of ctfs) {
      // I'm not sure if this works in all cases
      // e.g. if ctfs aren't at /#/ctf/<id> but at /ctfnote/#/ctf/<id>
      // or if the API is at a different URL.
      // The alternative would be to link to the CTF website, but that's
      // not really great either.
      const ctf_url = new URL(
        `/#/ctf/${ctf.id}-${slugify(ctf.title)}/info`,
        `${req.protocol}://${req.headers.host}`
      );

      cal.createEvent({
        start: ctf.start_time,
        end: ctf.end_time,
        description: ctf.description,
        summary: ctf.title,
        url: ctf_url.href,
      });
    }

    cal.serve(res);
  };
}
