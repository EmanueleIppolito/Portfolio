const pool = require("../config/db.js")


async function index(req, res, next) {
    try {
        const { title, originalTitle, author, genre, tag, isOnGoing } = req.query;

        let sql = "SELECT * FROM mangas WHERE 1=1";
        const values = [];

        if (title) {
            sql += " AND title LIKE ?";
            values.push(`%${title}%`);
        }

        if (originalTitle) {
            sql += " AND original_title LIKE ?";
            values.push(`%${originalTitle}%`);
        }

        if (author) {
            sql += " AND author LIKE ?";
            values.push(`%${author}%`);
        }

        if (isOnGoing !== undefined) {
            sql += " AND is_on_going = ?";
            values.push(isOnGoing === "true");
        }

        if (genre) {
            const requestedGenres = genre.split(",").map(singleGenre => singleGenre.trim());

            for (const singleGenre of requestedGenres) {
                sql += `
                    AND EXISTS (
                        SELECT 1
                        FROM manga_genres
                        JOIN genres ON manga_genres.genre_id = genres.id
                        WHERE manga_genres.manga_id = mangas.id
                        AND genres.name = ?
                    )
                `;
                values.push(singleGenre);
            }
        }

        if (tag) {
            const requestedTags = tag.split(",").map(singleTag => singleTag.trim());

            for (const singleTag of requestedTags) {
                sql += `
                    AND EXISTS (
                        SELECT 1
                        FROM manga_tags
                        JOIN tags ON manga_tags.tag_id = tags.id
                        WHERE manga_tags.manga_id = mangas.id
                        AND tags.name = ?
                    )
                `;
                values.push(singleTag);
            }
        }

        const [rows] = await pool.query(sql, values);

        const mangasWithDetails = await Promise.all(
            rows.map(async (manga) => {
                const [genreRows] = await pool.query(
                    `
                    SELECT genres.name
                    FROM manga_genres
                    JOIN genres ON manga_genres.genre_id = genres.id
                    WHERE manga_genres.manga_id = ?
                    `,
                    [manga.id]
                );

                const [tagRows] = await pool.query(
                    `
                    SELECT tags.name
                    FROM manga_tags
                    JOIN tags ON manga_tags.tag_id = tags.id
                    WHERE manga_tags.manga_id = ?
                    `,
                    [manga.id]
                );

                return {
                    id: manga.id,
                    title: manga.title,
                    originalTitle: manga.original_title,
                    author: manga.author,
                    genre: genreRows.map(singleGenre => singleGenre.name),
                    cover: manga.cover,
                    isOnGoing: manga.is_on_going,
                    plot: manga.plot,
                    volumes: manga.volumes,
                    publishDate: manga.publish_date,
                    publisher: manga.publisher,
                    tag: tagRows.map(singleTag => singleTag.name)
                };
            })
        );

        res.json(mangasWithDetails);
    } catch (err) {
        next(err);
    }
}


async function show(req, res, next) {
    try {
        const id = parseInt(req.params.id);

        const [rows] = await pool.query(
            `SELECT * FROM mangas WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: "Manga non trovato"
            });
        }

        const manga = rows[0];

        const [genreRows] = await pool.query(
            `
            SELECT genres.name
            FROM manga_genres
            JOIN genres ON manga_genres.genre_id = genres.id
            WHERE manga_genres.manga_id = ?
            `,
            [id]
        );

        const [tagRows] = await pool.query(
            `
            SELECT tags.name
            FROM manga_tags
            JOIN tags ON manga_tags.tag_id = tags.id
            WHERE manga_tags.manga_id = ?
            `,
            [id]
        );

        const mangaWithDetails = {
            id: manga.id,
            title: manga.title,
            originalTitle: manga.original_title,
            author: manga.author,
            genre: genreRows.map(singleGenre => singleGenre.name),
            cover: manga.cover,
            isOnGoing: manga.is_on_going,
            plot: manga.plot,
            volumes: manga.volumes,
            publishDate: manga.publish_date,
            publisher: manga.publisher,
            tag: tagRows.map(singleTag => singleTag.name)
        };

        res.json(mangaWithDetails);
    } catch (err) {
        next(err);
    }
}

async function store(req, res, next) {
    try {
        const {
            title,
            originalTitle,
            author,
            cover,
            isOnGoing,
            plot,
            volumes,
            publishDate,
            publisher,
            genre = [],
            tag = []
        } = req.body;

        const mangaSql = `
            INSERT INTO mangas
            (title, original_title, author, cover, is_on_going, plot, volumes, publish_date, publisher)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const mangaValues = [
            title,
            originalTitle,
            author,
            cover,
            isOnGoing,
            plot,
            volumes,
            publishDate,
            publisher
        ];

        const [mangaResult] = await pool.query(mangaSql, mangaValues);
        const mangaId = mangaResult.insertId;

        for (const singleGenre of genre) {
            const [existingGenres] = await pool.query(
                `SELECT id FROM genres WHERE name = ?`,
                [singleGenre]
            );

            let genreId;

            if (existingGenres.length > 0) {
                genreId = existingGenres[0].id;
            } else {
                const [genreResult] = await pool.query(
                    `INSERT INTO genres (name) VALUES (?)`,
                    [singleGenre]
                );
                genreId = genreResult.insertId;
            }

            await pool.query(
                `INSERT INTO manga_genres (manga_id, genre_id) VALUES (?, ?)`,
                [mangaId, genreId]
            );
        }

        for (const singleTag of tag) {
            const [existingTags] = await pool.query(
                `SELECT id FROM tags WHERE name = ?`,
                [singleTag]
            );

            let tagId;

            if (existingTags.length > 0) {
                tagId = existingTags[0].id;
            } else {
                const [tagResult] = await pool.query(
                    `INSERT INTO tags (name) VALUES (?)`,
                    [singleTag]
                );
                tagId = tagResult.insertId;
            }

            await pool.query(
                `INSERT INTO manga_tags (manga_id, tag_id) VALUES (?, ?)`,
                [mangaId, tagId]
            );
        }

        const newManga = {
            id: mangaId,
            title,
            originalTitle,
            author,
            genre,
            cover,
            isOnGoing,
            plot,
            volumes,
            publishDate,
            publisher,
            tag
        };

        res.status(201).json({
            message: "Manga aggiunto con successo",
            manga: newManga
        });
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const id = parseInt(req.params.id);

        const {
            title,
            originalTitle,
            author,
            cover,
            isOnGoing,
            plot,
            volumes,
            publishDate,
            publisher,
            genre = [],
            tag = []
        } = req.body;

        const [rows] = await pool.query(
            `SELECT * FROM mangas WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: "Manga non trovato"
            });
        }

        await pool.query(
            `
            UPDATE mangas
            SET title = ?, original_title = ?, author = ?, cover = ?, is_on_going = ?, plot = ?, volumes = ?, publish_date = ?, publisher = ?
            WHERE id = ?
            `,
            [
                title,
                originalTitle,
                author,
                cover,
                isOnGoing,
                plot,
                volumes,
                publishDate,
                publisher,
                id
            ]
        );

        await pool.query(
            `DELETE FROM manga_genres WHERE manga_id = ?`,
            [id]
        );

        for (const singleGenre of genre) {
            const [existingGenres] = await pool.query(
                `SELECT id FROM genres WHERE name = ?`,
                [singleGenre]
            );

            let genreId;

            if (existingGenres.length > 0) {
                genreId = existingGenres[0].id;
            } else {
                const [genreResult] = await pool.query(
                    `INSERT INTO genres (name) VALUES (?)`,
                    [singleGenre]
                );
                genreId = genreResult.insertId;
            }

            await pool.query(
                `INSERT INTO manga_genres (manga_id, genre_id) VALUES (?, ?)`,
                [id, genreId]
            );
        }

        await pool.query(
            `DELETE FROM manga_tags WHERE manga_id = ?`,
            [id]
        );

        for (const singleTag of tag) {
            const [existingTags] = await pool.query(
                `SELECT id FROM tags WHERE name = ?`,
                [singleTag]
            );

            let tagId;

            if (existingTags.length > 0) {
                tagId = existingTags[0].id;
            } else {
                const [tagResult] = await pool.query(
                    `INSERT INTO tags (name) VALUES (?)`,
                    [singleTag]
                );
                tagId = tagResult.insertId;
            }

            await pool.query(
                `INSERT INTO manga_tags (manga_id, tag_id) VALUES (?, ?)`,
                [id, tagId]
            );
        }

        const updatedManga = {
            id,
            title,
            originalTitle,
            author,
            genre,
            cover,
            isOnGoing,
            plot,
            volumes,
            publishDate,
            publisher,
            tag
        };

        res.status(200).json({
            message: `Il manga "${updatedManga.title}" è stato aggiornato`,
            manga: updatedManga
        });
    } catch (err) {
        next(err);
    }
}

    async function modify(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const body = req.body;

        const [rows] = await pool.query(
            `SELECT * FROM mangas WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: "Manga non trovato"
            });
        }

        const manga = rows[0];

        const [genreRows] = await pool.query(
            `
            SELECT genres.name
            FROM manga_genres
            JOIN genres ON manga_genres.genre_id = genres.id
            WHERE manga_genres.manga_id = ?
            `,
            [id]
        );

        const [tagRows] = await pool.query(
            `
            SELECT tags.name
            FROM manga_tags
            JOIN tags ON manga_tags.tag_id = tags.id
            WHERE manga_tags.manga_id = ?
            `,
            [id]
        );

        const currentGenres = genreRows.map(singleGenre => singleGenre.name);
        const currentTags = tagRows.map(singleTag => singleTag.name);

        const updatedManga = {
            title: body.title ?? manga.title,
            originalTitle: body.originalTitle ?? manga.original_title,
            author: body.author ?? manga.author,
            genre: body.genre ?? currentGenres,
            cover: body.cover ?? manga.cover,
            isOnGoing: body.isOnGoing ?? manga.is_on_going,
            plot: body.plot ?? manga.plot,
            volumes: body.volumes ?? manga.volumes,
            publishDate: body.publishDate ?? manga.publish_date,
            publisher: body.publisher ?? manga.publisher,
            tag: body.tag ?? currentTags
        };

        await pool.query(
            `
            UPDATE mangas
            SET title = ?, original_title = ?, author = ?, cover = ?, is_on_going = ?, plot = ?, volumes = ?, publish_date = ?, publisher = ?
            WHERE id = ?
            `,
            [
                updatedManga.title,
                updatedManga.originalTitle,
                updatedManga.author,
                updatedManga.cover,
                updatedManga.isOnGoing,
                updatedManga.plot,
                updatedManga.volumes,
                updatedManga.publishDate,
                updatedManga.publisher,
                id
            ]
        );

        await pool.query(
            `DELETE FROM manga_genres WHERE manga_id = ?`,
            [id]
        );

        for (const singleGenre of updatedManga.genre) {
            const [existingGenres] = await pool.query(
                `SELECT id FROM genres WHERE name = ?`,
                [singleGenre]
            );

            let genreId;

            if (existingGenres.length > 0) {
                genreId = existingGenres[0].id;
            } else {
                const [genreResult] = await pool.query(
                    `INSERT INTO genres (name) VALUES (?)`,
                    [singleGenre]
                );
                genreId = genreResult.insertId;
            }

            await pool.query(
                `INSERT INTO manga_genres (manga_id, genre_id) VALUES (?, ?)`,
                [id, genreId]
            );
        }

        await pool.query(
            `DELETE FROM manga_tags WHERE manga_id = ?`,
            [id]
        );

        for (const singleTag of updatedManga.tag) {
            const [existingTags] = await pool.query(
                `SELECT id FROM tags WHERE name = ?`,
                [singleTag]
            );

            let tagId;

            if (existingTags.length > 0) {
                tagId = existingTags[0].id;
            } else {
                const [tagResult] = await pool.query(
                    `INSERT INTO tags (name) VALUES (?)`,
                    [singleTag]
                );
                tagId = tagResult.insertId;
            }

            await pool.query(
                `INSERT INTO manga_tags (manga_id, tag_id) VALUES (?, ?)`,
                [id, tagId]
            );
        }

        res.status(200).json({
            message: `Il manga "${updatedManga.title}" è stato modificato con successo`,
            manga: {
                id,
                ...updatedManga
            }
        });
    } catch (err) {
        next(err);
    }
}

async function destroy(req, res, next) {
    try {
        const id = parseInt(req.params.id);

        const [rows] = await pool.query(
            `SELECT * FROM mangas WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: "Manga non trovato"
            });
        }

        const manga = rows[0];

        await pool.query(
            `DELETE FROM mangas WHERE id = ?`,
            [id]
        );

        res.status(200).json({
            message: `Il manga "${manga.title}" è stato eliminato`
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    index,
    show,
    store,
    update,
    modify,
    destroy
};