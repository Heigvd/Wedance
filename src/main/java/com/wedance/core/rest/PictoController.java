/*
 * Wedance
 */
package com.wedance.core.rest;

import com.sun.jersey.multipart.FormDataBodyPart;
import com.sun.jersey.multipart.FormDataParam;
import com.wedance.core.ejb.PictoFacade;
import com.wedance.core.persistence.FilePicto;
import com.wedance.core.persistence.Picto;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.*;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.apache.commons.io.IOUtils;

/**
 *
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
@Stateless
@Path("Picto")
public class PictoController extends AbstractRestController<PictoFacade, Picto> {

    /**
     *
     */
    @EJB
    private PictoFacade pictoFacade;

    /**
     *
     * @return
     */
    @Override
    protected PictoFacade getFacade() {
        return pictoFacade;
    }

    @POST
    @Path("{tuneId: [1-9][0-9]*}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Picto createPicto(@PathParam("tuneId") Long tuneId, Picto p) {
        pictoFacade.createPicto(tuneId, p);
        return p;
    }

    @POST
    @Path("Upload/{tuneId: [1-9][0-9]*}")
    @Consumes("image/jpeg")
    //@Produces(MediaType.APPLICATION_JSON)
    public String uploadPicto(@PathParam("tuneId") Long tuneId, byte[] data) throws IOException {
        FilePicto p = new FilePicto();
        p.setData(data);
        p.setMimeType("image/jpeg");
        //p.setName();
        pictoFacade.createPicto(tuneId, p);
        return p.toJson();
    }

    @POST
    @Path("Upload/{tuneId: [1-9][0-9]*}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Picto uploadPicto(@PathParam("tuneId") Long tuneId,
            @FormDataParam("Filedata") InputStream file,
            @FormDataParam("Filedata") FormDataBodyPart details) throws IOException {
        FilePicto p = new FilePicto();
        p.setData(IOUtils.toByteArray(file));
        p.setName(details.getContentDisposition().getFileName());
        p.setMimeType(details.getMediaType().toString());
        pictoFacade.createPicto(tuneId, p);
        return p;
    }

    @GET
    @Path("Read/{pictoId: [1-9][0-9]*}")
    public Response doread(@PathParam("pictoId") Long pictoId) {
        FilePicto f = (FilePicto) pictoFacade.find(pictoId);

        CacheControl cc = new CacheControl();
        cc.setPrivate(true);
        //cc.setNoTransform(true);
        //cc.setMustRevalidate(false);
        //cc.setNoCache(false);
        cc.setMaxAge(3600);

        //EntityTag etag = new EntityTag();
        //Response.ResponseBuilder responseBuilder = request.evaluatePreconditions(updateTimestamp, etag);

        //return Response.ok(new ByteArrayInputStream(f.getData())).            // Streamed
        //return Response.ok(f.getData());                                      // non-streamed
        return Response.ok().
                entity(f.getData()).
                header("Content-Type", f.getMimeType()).
                type(f.getMimeType()).
                cacheControl(cc).
                //lastModified(updateTimestamp).
                //expires(expirationTimestamp).
                //tag(etag).
                build();
    }
}
