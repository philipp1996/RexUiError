import Methods from './Methods.js';
import IsFunction from '../../utils/object/IsFunction.js';
import GetValue from '../../utils/object/GetValue.js';
import IsPlainObject from '../../utils/object/IsPlainObject.js';

class Match {
    constructor(config) {
        this.symbols = []; // tileX+(tileY*board.width)
        this.dirMask = {};
        this.resetFromJSON(config);
        this.boot();
    }

    resetFromJSON(o) {
        this.setBoard(GetValue(o, 'board', undefined));
        this.setWildcard(GetValue(o, 'wildcard', undefined));

        var dirMask = GetValue(o, 'dirMask', undefined);
        if (dirMask !== undefined) {
            this.setDirMask(dirMask);
        }
        return this;
    }

    boot() {}

    shutdown() {
        this.board = undefined;
        this.symbols = undefined;
        this.dirMask = undefined;
        return this;
    }

    destroy() {
        this.shutdown();
        return this;
    }

    setBoard(board) {
        this.board = board;
        if (board) {
            this.clearSymbols();
        }
        return this;
    }

    setDirMask(dir, value) {
        if (IsPlainObject(dir)) {
            var dirMask = dir;
            for (dir in dirMask) {
                this.dirMask[dir] = dirMask[dir];
            }
        } else {
            this.dirMask[dir] = value;
        }
        return this;
    }

    setDirectionMode(mode) {
        this.board.grid.setDirectionMode(mode);
        return this;
    }

    clearSymbols() {
        this.refreshSymbols(null);
        return this;
    }

    setSymbol(tileX, tileY, callback, scope) {
        var board = this.board;
        if (!board.contains(tileX, tileY)) {
            return this;
        }
        var symbol;
        if (IsFunction(callback)) {
            globTileXY.x = tileX;
            globTileXY.y = tileY;
            if (scope) {
                symbol = callback.call(scope, globTileXY, board);
            } else {
                symbol = callback(globTileXY, board);
            }
        } else {
            symbol = callback;
        }

        this.symbols[this.tileXYToKey(tileX, tileY)] = symbol;
        return this;
    }

    getSymbol(tileX, tileY) {
        return this.symbols[this.tileXYToKey(tileX, tileY)];
    }

    dumpSymobls(callback, scope) {
        var board = this.board;
        var tileXY, symbol;
        for (var i = 0, cnt = this.symbols.length; i < cnt; i++) {
            symbol = this.symbols[i];
            tileXY = this.keyToTileXY(i);
            if (scope) {
                callback.call(scope, tileXY, symbol, board);
            } else {
                callback(tileXY, symbol, board);
            }
        }
        return this;
    }

    refreshSymbols(callback, scope) {
        var board = this.board;
        var width = board.width,
            height = board.height;
        this.symbols.length = width * height;

        var symbol;
        if (IsFunction(callback)) {
            // Get symbol by callback
            var tileXY;
            for (var i = 0, cnt = this.symbols.length; i < cnt; i++) {
                tileXY = this.keyToTileXY(i);
                if (scope) {
                    symbol = callback.call(scope, tileXY, board);
                } else {
                    symbol = callback(tileXY, board);
                }
                this.symbols[i] = symbol;
            }

        } else {
            // Fill a given symbol
            symbol = callback;
            for (var i = 0, cnt = this.symbols.length; i < cnt; i++) {
                this.symbols[i] = symbol;
            }
        }
        return this;
    }

    setWildcard(symbol) {
        this.wildcard = symbol;
        return this;
    }

    tileXYToKey(tileX, tileY) {
        return tileX + (tileY * this.board.width);
    }

    keyToTileXY(key, out) {
        if (out === undefined) {
            out = {};
        }
        var width = this.board.width;
        out.x = key % width;
        out.y = Math.floor(key / width);
        return out;
    }

    anyMatch(pattern) {
        return this.match(pattern, null, null, true);
    }
}

var globTileXY = {
    x: 0,
    y: 0
};

Object.assign(
    Match.prototype,
    Methods
);

export default Match;