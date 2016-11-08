CREATE TABLE IF NOT EXISTS HighScore (
    Username TEXT NOT NULL,
    Score NUMERIC,
    GameType CHAR(20) NOT NULL
);

CREATE TRIGGER TopConstraint AFTER INSERT ON HighScore
	FOR EACH ROW
	BEGIN
		IF( (SELECT COUNT(*) 
            FROM HighScore
            WHERE HighScore.GameType = NEW.GameType) > 10) THEN
				DELETE
				FROM HighScore
				WHERE HighScore.GameType = NEW.GameType
					AND HighScore.Score = ( SELECT MIN(Score)
											FROM HighScore
											WHERE HighScore.GameType = NEW.GameType);
		END IF;
	END;