import { exec } from "child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const legacyScript = "ts-node legacy/orderReportLegacy.ts";
const legacyFolder = join(__dirname, "../legacy/expected")
const legacyReportFilePath = join(legacyFolder, "./report.txt");

describe('Golden master test', () =>{
    it('Should match legacy output', (done) =>{
        exec(legacyScript, (legacyError, legacyStdout) =>{
            if(legacyError) return done(legacyError)

            // Check if report.txt exists in the expected folder and create it if it does not exist
            if(!existsSync(legacyFolder)){
                mkdirSync(legacyFolder, {recursive: true})
            }

            if(!existsSync(legacyReportFilePath)){
                writeFileSync(legacyReportFilePath, legacyStdout, 'utf-8')
                return done()
            }

            // Compare the refactored output with the expected report file
            exec("ts-node src/main.ts", (srcError, srcStdout)=>{
                if(srcError) return done(srcError)
                const expected = readFileSync(legacyReportFilePath, "utf-8")
                expect(srcStdout).toBe(expected)
                done()
            })
        })
    })
})