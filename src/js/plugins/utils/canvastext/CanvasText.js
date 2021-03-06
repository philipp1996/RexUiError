import PenManagerKlass from './PenManager.js';
import CONST from './const.js';
import WrapText from './WrapText.js';
import Clone from '../object/Clone.js';

const GetValue = Phaser.Utils.Objects.GetValue;
const NO_WRAP = CONST.NO_WRAP;
const NO_NEWLINE = CONST.NO_NEWLINE;
const HALIGN_LEFT = CONST.hleft;
const HALIGN_CENTER = CONST.hcenter;
const HALIGN_RIGHT = CONST.hright;
const VALIGN_TOP = CONST.vtop;
const VALIGN_CENTER = CONST.vcenter;
const VALIGN_BOTTOM = CONST.vbottom;

class CanvasText {
    constructor(config) {
        this.context = GetValue(config, 'context', null);
        this.canvas = this.context.canvas;
        this.parser = GetValue(config, 'parser', null);
        this.defatultStyle = GetValue(config, 'style', null);
        this.autoRound = true;

        this.pensPool = GetValue(config, 'pensPool', null);
        this.penManager = this.newPenManager();
        this._tmpPenManager = null;

        var context = this.context;
        this.getTextWidth = function (text) {
            return context.measureText(text).width;
        }
    }

    updatePenManager(text, wrapMode, wrapWidth, lineHeight, penManager) {
        if (penManager === undefined) {
            penManager = this.penManager;
        }
        penManager.freePens();
        if (text === "") {
            return penManager;
        }

        var canvas = this.canvas;
        var context = this.context;

        var cursorX = 0,
            cursorY = 0;

        var plainText, curProp, curStyle;
        var match = this.parser.splitText(text),
            result, wrapLines;
        for (var i = 0, len = match.length; i < len; i++) {
            result = this.parser.tagTextToProp(match[i], curProp);
            plainText = result.plainText;
            curProp = result.prop;

            // wrap text to lines
            if (plainText !== '') {
                // Save the current context.
                this.context.save();
                curStyle = this.parser.propToContextStyle(
                    this.defatultStyle,
                    curProp
                );
                curStyle.buildFont();
                curStyle.syncFont(canvas, context);
                curStyle.syncStyle(canvas, context);
                wrapLines = WrapText(
                    plainText,
                    this.getTextWidth,
                    wrapMode,
                    wrapWidth,
                    cursorX
                );

                // add pens
                for (var j = 0, jLen = wrapLines.length; j < jLen; j++) {
                    var n = wrapLines[j];
                    penManager.addPen(
                        n.text,
                        cursorX,
                        cursorY,
                        n.width,
                        Clone(curProp),
                        n.newLineMode
                    );

                    if (n.newLineMode !== NO_NEWLINE) {
                        cursorX = 0;
                        cursorY += lineHeight;
                    } else {
                        cursorX += n.width;
                    }

                }
                this.context.restore();
            }

        }

        return penManager;
    }

    draw(startX, startY, boxWidth, boxHeight, penManager) {
        if (penManager === undefined) {
            penManager = this.penManager;
        }
        var context = this.context;
        context.save();

        // this.clear();
        this.drawBackground();

        // draw lines
        var defatultStyle = this.defatultStyle;
        startX += (defatultStyle.strokeThickness / 2);
        startY += (defatultStyle.strokeThickness / 2) + defatultStyle.metrics.ascent;
        var halign = defatultStyle.halign,
            valign = defatultStyle.valign;

        var lineWidth, lineHeight = defatultStyle.lineHeight;
        var lines = penManager.lines;
        var totalLinesNum = lines.length,
            maxLines = defatultStyle.maxLines;
        var drawLinesNum, drawLineStartIdx, drawLineEndIdx;
        if ((maxLines > 0) && (totalLinesNum > maxLines)) {
            drawLinesNum = maxLines;
            if (valign === VALIGN_CENTER) { // center
                drawLineStartIdx = Math.floor((totalLinesNum - drawLinesNum) / 2);
            } else if (valign === VALIGN_BOTTOM) { // bottom
                drawLineStartIdx = totalLinesNum - drawLinesNum;
            } else {
                drawLineStartIdx = 0;
            }
        } else {
            drawLinesNum = totalLinesNum;
            drawLineStartIdx = 0;
        }
        drawLineEndIdx = drawLineStartIdx + drawLinesNum;

        var offsetX, offsetY;
        if (valign === VALIGN_CENTER) { // center
            offsetY = Math.max((boxHeight - (drawLinesNum * lineHeight)) / 2, 0);
        } else if (valign === VALIGN_BOTTOM) { // bottom
            offsetY = Math.max(boxHeight - (drawLinesNum * lineHeight) - 2, 0);
        } else {
            offsetY = 0;
        }
        offsetY += startY;
        for (var lineIdx = drawLineStartIdx; lineIdx < drawLineEndIdx; lineIdx++) {
            lineWidth = penManager.getLineWidth(lineIdx);
            if (lineWidth === 0) {
                continue;
            }

            if (halign === HALIGN_CENTER) { // center
                offsetX = (boxWidth - lineWidth) / 2;
            } else if (halign === HALIGN_RIGHT) { // right
                offsetX = boxWidth - lineWidth;
            } else {
                offsetX = 0;
            }
            offsetX += startX;

            var pens = lines[lineIdx];
            for (var penIdx = 0, pensLen = pens.length; penIdx < pensLen; penIdx++) {
                this.drawPen(pens[penIdx], offsetX, offsetY);
            }
        }

        context.restore();
    }

    clear() {
        var canvas = this.canvas;
        this.context.clearRect(0, 0, canvas.width, canvas.height);
    }

    drawBackground() {
        var color = this.defatultStyle.backgroundColor;
        if (color === null) {
            return;
        }
        var context = this.context;
        var canvas = this.canvas;
        context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    drawUnderline(x, y, width, thickness, color) {
        if (thickness <= 0) {
            return;
        }

        var context = this.context;
        var savedLineCap = context.lineCap;
        context.lineCap = 'butt';
        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth = thickness;
        context.moveTo(x, y);
        context.lineTo((x + width), y);
        context.stroke();
        context.lineCap = savedLineCap;
    }

    drawPen(pen, offsetX, offsetY) {
        var canvas = this.canvas;
        var context = this.context;
        context.save();

        var curStyle = this.parser.propToContextStyle(
            this.defatultStyle,
            pen.prop
        );
        curStyle.buildFont();
        curStyle.syncFont(canvas, context);
        curStyle.syncStyle(canvas, context);

        offsetX += pen.x;
        offsetY += pen.y;
        if (this.autoRound) {
            offsetX = Math.round(offsetX);
            offsetY = Math.round(offsetY);
        }

        var text = pen.text;
        var penWidth = pen.width;

        // underline
        this.drawUnderline(
            offsetX, // x
            (offsetY + curStyle.underlineOffset), // y
            penWidth, // width
            curStyle.underlineThickness, // thinkness
            curStyle.underlineColor // color
        );

        // draw image: TODO

        // draw text
        if (curStyle.strokeThickness) {
            curStyle.syncShadow(context, curStyle.shadowStroke);

            context.strokeText(text, offsetX, offsetY);
        }

        if (curStyle.color && (curStyle.color !== 'none')) {
            curStyle.syncShadow(context, curStyle.shadowFill);

            context.fillText(text, offsetX, offsetY);
        }

        context.restore();
    }

    destroy() {
        this.context = undefined;
        this.canvas = undefined;
        this.parser = undefined;
        this.defatultStyle = undefined;

        this.penManager.destroy();
        this.penManager = undefined;
        if (this._tmpPenManager) {
            this._tmpPenManager.destroy();
            this._tmpPenManager = undefined;
        }
    }

    get lines() {
        return this.penManager.lines;
    }

    get desplayLinesCount() {
        var linesCount = this.penManager.linesCount,
            maxLines = this.defatultStyle.maxLines;
        if ((maxLines > 0) && (linesCount > maxLines)) {
            linesCount = maxLines;
        }
        return linesCount;
    }

    get linesWidth() {
        return this.penManager.getMaxLineWidth();
    }

    get linesHeight() {
        var linesCount = this.desplayLinesCount;
        var linesHeight = (this.defatultStyle.lineHeight * linesCount);
        if (linesCount > 0) {
            linesHeight -= this.defatultStyle.lineSpacing;
        }
        return linesHeight;
    }

    newPenManager() {
        PENSMANAGER_CONFIG.pensPool = this.pensPool;
        PENSMANAGER_CONFIG.tagToText = this.parser.propToTagText;
        PENSMANAGER_CONFIG.tagToTextScope = this.parser;
        return new PenManagerKlass(PENSMANAGER_CONFIG);
    }

    get tmpPenManager() {
        if (this._tmpPenManager === null) {
            this._tmpPenManager = this.newPenManager();
        }
        return this._tmpPenManager;
    }

    getPlainText(text, start, end) {
        var plainText;
        if (text == null) {
            plainText = this.penManager.plainText;
        } else {
            var m, match = this.parser.splitText(text, 1); // PLAINTEXTONLY_MODE
            plainText = "";
            for (var i = 0, len = match.length; i < len; i++) {
                plainText += match[i];
            }
        }

        if ((start != null) || (end != null)) {
            if (start == null) {
                start = 0;
            }
            if (end == null) {
                end = plainText.length;
            }
            plainText = plainText.substring(start, end);
        }

        return plainText;
    }

    getPenManager(text, retPenManager) {
        if (text === undefined) {
            return this.copyPenManager(retPenManager, this.penManager);
        }

        if (retPenManager === undefined) {
            retPenManager = this.newPenManager();
        }

        var defatultStyle = this.defatultStyle;
        this.updatePenManager(
            text,
            defatultStyle.wrapMode,
            defatultStyle.wrapWidth,
            defatultStyle.lineHeight,
            retPenManager
        );
        return retPenManager;
    }

    getText(text, start, end, wrap) {
        if (text == null) {
            return this.penManager.getSliceTagText(start, end, wrap);
        }

        var penManager = this.tmpPenManager;
        var defatultStyle = this.defatultStyle;
        this.updatePenManager(
            text,
            defatultStyle.wrapMode,
            defatultStyle.wrapWidth,
            defatultStyle.lineHeight,
            penManager
        );

        return penManager.getSliceTagText(start, end, wrap);
    }

    copyPenManager(ret, src) {
        if (src === undefined) {
            src = this.penManager;
        }
        return src.copy(ret);
    }

    getTextWidth(penManager) {
        if (penManager === undefined) {
            penManager = this.penManager;
        }

        return penManager.getMaxLineWidth();
    }

    getLastPen(penManager) {
        if (penManager === undefined) {
            penManager = this.penManager;
        }

        return penManager.lastPen;
    }
};

var PENSMANAGER_CONFIG = {};

export default CanvasText;