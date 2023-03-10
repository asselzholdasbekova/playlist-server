import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Song } from "../entity/Song";
import { SelectQueryBuilder } from 'typeorm';

export class SongController {

    static postSong = async (req: Request, res: Response) => {
        const newSong = {
            title: req.body.title,
            yearOfRelease: req.body.year_of_release,
            author: req.body.author_id,
            genre: req.body.genre_id
        }
        const song = AppDataSource.getRepository(Song).create(newSong);
        const result = await AppDataSource.getRepository(Song).save(song);

        return res.json(result);
    }

    static updateSong = async (req: Request, res: Response) => {
        const song = await AppDataSource.getRepository(Song).findOne({ where: { id: Number(req.params.id) } });

        if (song) {
            AppDataSource.getRepository(Song).merge(song, req.body);
            const result = await AppDataSource.getRepository(Song).save(song);

            return res.json(result);
        }
        return res.json({ msg: "Song Not Found!" });
    }

    static deleteSong = async (req: Request, res: Response) => {
        const id = req.params.id;
        const song = await AppDataSource.getRepository(Song).delete(id);
        return res.json(song);
    }

    static getSongById = async (req: Request, res: Response) => {
        const song = await AppDataSource.getRepository(Song).findOne({ where: { id: Number(req.params.id) }, relations: { genre: true, author: true } });
        return res.json(song);
    }

    static getSongsBy = async (req: Request, res: Response) => {
        const query = AppDataSource
        .getRepository(Song)
        .createQueryBuilder("song");

        if (req.body.author_id) {
            query.andWhere("song.author_id  = :author", { author: req.body.author_id });
        }
        if (req.body.genre_id) {
            query.andWhere("song.genre_id  = :genre", { genre: req.body.genre_id });
        }
        if (req.body.year_of_release) {
            query.andWhere("song.year_of_release  = :yearOfRelease", { yearOfRelease: req.body.year_of_release });
        }
    
        return res.json(await query.getMany());
    }

    static getAllSongs = async (req: Request, res: Response) => {
        const result = await AppDataSource.getRepository(Song).find({ relations: { genre: true, author: true } });
        return res.json(result);
    }
    
}