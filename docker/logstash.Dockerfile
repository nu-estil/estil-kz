FROM docker.elastic.co/logstash/logstash:7.9.3

# install dependency
# RUN /usr/share/logstash/bin/logstash-plugin install logstash-input-jdbc
# RUN /usr/share/logstash/bin/logstash-plugin install logstash-filter-aggregate
# RUN /usr/share/logstash/bin/logstash-plugin install logstash-filter-jdbc_streaming
# RUN /usr/share/logstash/bin/logstash-plugin install logstash-filter-mutate


# copy lib database jdbc jars
# COPY ./config/logstash/jdbc/postgresql-42.2.8.jar /usr/share/logstash/logstash-core/lib/jars/postgresql.jar
# copy queries
# COPY ./config/logstash/jdbc/queries/ /usr/share/logstash/config/queries/

ENTRYPOINT ["/usr/local/bin/docker-entrypoint"]