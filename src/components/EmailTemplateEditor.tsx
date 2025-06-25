import { forwardRef, useImperativeHandle, useRef } from "react";
import { EmailEditor } from "react-email-editor";
import { Button } from "@/components/ui/button";
import { createTemplate, sendTemplateRequest } from "../../services/api";
import useClient from "@/hooks/client-hook";

export interface EmailTemplateEditorRef {
    exportHtml: () => void;
}

interface EmailTemplateEditorProps {
    onExport?: (data: { design: any; html: string }) => void;
    onCloseRequest?: () => void;
    templateName: string;
    templateTitle: string;
    templateCategory: string;
    handleTemplates: () => void;
    handleFetchCampaigns: () => void;
}

const EmailTemplateEditor = forwardRef<EmailTemplateEditorRef, EmailTemplateEditorProps>(
    ({ onExport, onCloseRequest, templateName, templateTitle, templateCategory, handleTemplates, handleFetchCampaigns }, ref) => {
        const emailEditorRef = useRef<any>(null);
        const { client } = useClient();


        const handleTemplateExport = (data: { design: any; html: string }) => {
            if (!client?.id) return;
            const { html } = data;
            sendTemplateRequest({
                client_id: client.id,
                message: html,
                subject: templateTitle,
                category: templateCategory,
            })
                .then((resp: any) => {
                    console.log("Template created", resp.data)
                    handleTemplates()
                    handleFetchCampaigns()
                    onCloseRequest?.()
                })
                .catch((err: any) => console.error(err));
        };
        const exportHtml = () => {
            if (emailEditorRef.current) {
                emailEditorRef.current.editor.exportHtml((data: any) => {
                    // const { design, html } = data;
                    // Provide to parent
                    onExport?.(data);
                    handleTemplateExport(data)
                });
            }
        };

        const loadDesign = () => {
            const design = {
                body: {
                    rows: [
                        {
                            cells: [1],
                            columns: [
                                {
                                    contents: [
                                        {
                                            type: "text",
                                            values: {
                                                text: "<p>This is editable content</p>"
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            cells: [1],
                            columns: [
                                {
                                    contents: [
                                        {
                                            type: "text",
                                            values: {
                                                text: "<p style='font-size:12px;'>© 2025 Your Company</p>"
                                            },
                                            locked: true
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    values: {}
                }
            };
            emailEditorRef.current?.editor?.loadDesign(design);
        };

        // Expose exportHtml to parent
        useImperativeHandle(ref, () => ({ exportHtml }));

        return (
            <div className="flex flex-col h-full w-full">
                {/* Toolbar */}
                <div className="flex items-center gap-2 border-b p-3 bg-muted/40 justify-start">
                    <Button size="sm" onClick={exportHtml}>
                        Save
                    </Button>
                    {/* <Button
                        size="sm"
                        variant="ghost"
                        onClick={onCloseRequest}
                        className="text-destructive"
                    >
                        Close
                    </Button> */}
                    <Button size="sm" variant="outline" onClick={loadDesign}>
                        Load Design
                    </Button>
                </div>
                {/* Editor Canvas */}
                <div className="flex-1 overflow-hidden">
                    <EmailEditor ref={emailEditorRef} onReady={loadDesign} />
                </div>
            </div>
        );
    }
);

EmailTemplateEditor.displayName = "EmailTemplateEditor";

export default EmailTemplateEditor;